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
      setErrorMsg("Password must be at least 6 characters.");
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
    <div className="container center-text">
      <h2>Register</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleRegister} className="form">
        <input
          type="text"
          className="input"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Apartment Number"
          value={apartmentNumber}
          onChange={(e) => setApartmentNumber(e.target.value)}
          required
        />
        <input
          type="email"
          className="input"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Tajni kod (ako imaš)"
          value={roleCode}
          onChange={(e) => setRoleCode(e.target.value)}
        />
        <button type="submit" className="button">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
