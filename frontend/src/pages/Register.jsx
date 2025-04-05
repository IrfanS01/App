import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import Navbar from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    apartmentNumber: "",
    email: "",
    password: "",
    roleCode: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { success, data, error } = await register(formData);

    if (success) {
      setSuccessMsg(data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setErrorMsg(error || "Error during registration.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="center-text">Register</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}
        <form onSubmit={handleRegister} className="form">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="apartmentNumber"
            type="text"
            placeholder="Apartment Number"
            value={formData.apartmentNumber}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="roleCode"
            type="text"
            placeholder="Admin Code (optional)"
            value={formData.roleCode}
            onChange={handleChange}
            className="input"
          />
          <button type="submit" className="button">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
