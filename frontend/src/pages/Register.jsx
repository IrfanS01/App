import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchHelper from "../api/fetchHelper";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!fullName || !apartmentNumber || !email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const payload = { email, password, fullName, apartmentNumber, roleCode };
    const { success, error } = await fetchHelper("/auth/register", "POST", payload, false);

    if (success) {
      setMessage("Registration successful. Please check your email.");
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setErrorMsg(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {message && <p style={styles.success}>{message}</p>}
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          name="apartmentNumber"
          type="text"
          placeholder="Apartment Number"
          value={apartmentNumber}
          onChange={(e) => setApartmentNumber(e.target.value)}
          style={styles.input}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          name="roleCode"
          type="text"
          placeholder="Tajni kod (samo za admina)"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
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
  success: { color: "green" },
};

export default Register;
