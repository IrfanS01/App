import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Reservations.css"; // ✅ Dodaj ovo

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
          Authorization: token ? `Bearer ${token}` : "",
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
          Authorization: token ? `Bearer ${token}` : "",
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
      <div className="reservations-container">
        <h2>Reservations</h2>
        {message && <p className="reservation-success">{message}</p>}
        {errorMsg && <p className="reservation-error">{errorMsg}</p>}

        <form onSubmit={handleReservation} className="reservation-form">
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="reservation-select"
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
            className="reservation-input"
          />
          <button type="submit" className="reservation-button">Reserve</button>
        </form>

        <ul>
          {reservations.map((res) => (
            <li key={res.id} className="reservation-item">
            <strong>{res.userName || "Unknown"} (Stan {res.apartmentNumber || "?"})</strong><br />
            <span style={{ fontWeight: 500 }}>{res.date}</span> — <a href={`mailto:${res.user}`}>Kontakt</a>
          </li>
          
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reservations;
