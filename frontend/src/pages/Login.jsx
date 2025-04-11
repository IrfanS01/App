import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchHelper from "../api/fetchHelper";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("✅ Login response:", data); // možeš ukloniti kasnije
  
      const token = data?.data?.token;
      const role = data?.data?.role;
      const fullName = data?.data?.fullName;
      const apartmentNumber = data?.data?.apartmentNumber;
  
      localStorage.setItem("token", token);
      console.log("✔️ Token postavljen:", token);
  
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("apartmentNumber", apartmentNumber);
  
      navigate("/dashboard");
    } else {
      setErrorMsg(error);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="center-text">Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <form onSubmit={handleLogin} className="form">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="input"
            required
          />
          <button type="submit" className="button">Sign in</button>
        </form>
      </div>
    </>
  );
};

export default Login;
