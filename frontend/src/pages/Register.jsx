import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset poruka
    setMessage("");
    setErrorMsg("");

    // Validacija polja
    if (!fullName || !apartmentNumber || !email || !password) {
      setErrorMsg("Sva polja su obavezna.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registracija uspješna. Provjerite email za verifikaciju.");
        // Opcionalno: preusmjeri korisnika na login
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErrorMsg(data.message || "Greška pri registraciji.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrorMsg("Greška u mreži. Pokušajte ponovo.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registracija</h2>
      {message && <p style={styles.success}>{message}</p>}
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Ime i Prezime"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Broj stana"
          value={apartmentNumber}
          onChange={(e) => setApartmentNumber(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email adresa"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Registruj se</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "1rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

export default Register;
