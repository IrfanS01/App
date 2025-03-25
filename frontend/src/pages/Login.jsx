import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchHelper from "../api/fetchHelper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log("🔗 API URL (env):", process.env.REACT_APP_API_URL);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    const { success, data, error } = await fetchHelper("/auth/login", "POST", { email, password }, false);

    if (success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("fullName", data.fullName);           // ✅ NOVO
      localStorage.setItem("apartmentNumber", data.apartmentNumber); // ✅ NOVO
      navigate("/dashboard");
    } else {
      setErrorMsg(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          style={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Sign in</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "400px", margin: "auto", padding: "1rem", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.5rem", fontSize: "1rem" },
  button: { padding: "0.5rem", fontSize: "1rem", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" },
  error: { color: "red" },
};

export default Login;
