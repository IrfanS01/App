import { useState } from "react";
import { register } from "../api/auth";
import "../styles/Register.css"; // ✅ Dodaj ovo

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    apartmentNumber: "",
    roleCode: "",
  });

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    const { success, data, error } = await register(formData);

    if (success) {
      setMessage(data.data.message);
      setFormData({
        email: "",
        password: "",
        fullName: "",
        apartmentNumber: "",
        roleCode: "",
      });
    } else {
      setErrorMsg(error);
    }
  };

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      {message && <p className="register-success">{message}</p>}
      {errorMsg && <p className="register-error">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="fullName"
          type="text"
          placeholder="Ime i prezime"
          value={formData.fullName}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          name="apartmentNumber"
          type="text"
          placeholder="Broj stana (npr. A1301)"
          value={formData.apartmentNumber}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email adresa"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          name="roleCode"
          type="text"
          placeholder="Admin kod (opcionalno)"
          value={formData.roleCode}
          onChange={handleChange}
          className="register-input"
        />
        <button type="submit" className="register-button">Registruj se</button>
      </form>
    </div>
  );
};

export default Register;
