import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setReservations(data.data);
      } else {
        setErrorMsg(data.message || "Error fetching reservations.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Network error.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const fullName = localStorage.getItem("fullName");
    const apartmentNumber = localStorage.getItem("apartmentNumber");

    if (!userEmail || !fullName || !apartmentNumber) {
      setErrorMsg("Nedostaje info. Prijavite se ponovo.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          user: userEmail,
          userName: fullName,
          apartmentNumber,
          type,
          date,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Reservation successful!");
        fetchReservations();
      } else {
        setErrorMsg(data.message || "Error making reservation.");
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setErrorMsg("Network error.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Reservations</h2>
        {message && <p style={styles.success}>{message}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <form onSubmit={handleReservation} style={styles.form}>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select reservation type</option>
            <option value="overnattningslagenhet">Övernattningslägenhet</option>
            <option value="takterras">Takterras</option>
          </select>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Reserve</button>
        </form>

        <ul>
          {reservations.map((res) => (
            <li key={res.id}>
              <strong>{res.userName || "Unknown"} (Stan {res.apartmentNumber || "?"})</strong> — {res.date} —
              <a href={`mailto:${res.user}`}>Kontakt</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "1rem" },
  form: { marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  input: { padding: "0.5rem", fontSize: "1rem" },
  button: { padding: "0.5rem", fontSize: "1rem", backgroundColor: "#2196F3", color: "white", border: "none", cursor: "pointer" },
  error: { color: "red" },
  success: { color: "green" },
};

export default Reservations;
