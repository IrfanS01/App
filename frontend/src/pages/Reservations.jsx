// Reservations.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReservations, createReservation, deleteReservation } from "../api/reservations";
import useFetchStatus from "../hooks/useFetchStatus";
import "../styles/Reservations.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { loading, error, success, start, finish } = useFetchStatus();

  useEffect(() => {
    const fetchReservations = async () => {
      start();
      const { success: ok, data, error } = await getReservations();
      if (ok) {
        setReservations(data.data);
        finish();
      } else {
        finish({ errorMessage: error });
      }
    };

    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    start();

    const userEmail = localStorage.getItem("userEmail");
    const fullName = localStorage.getItem("fullName");
    const apartmentNumber = localStorage.getItem("apartmentNumber");

    if (!userEmail || !fullName || !apartmentNumber) {
      finish({ errorMessage: "Missing user info. Please log in again." });
      return;
    }

    const result = await createReservation({
      user: userEmail,
      userName: fullName,
      apartmentNumber,
      type,
      date,
    });

    if (result.success) {
      finish({ successMessage: "Reservation successful!" });
      setType("");
      setDate("");
      const updated = await getReservations();
      if (updated.success) {
        setReservations(updated.data.data);
      }
    } else {
      finish({ errorMessage: result.error || "Error while creating reservation." });
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirm) return;

    const { success, error } = await deleteReservation(id);
    if (success) {
      setMessage("Reservation deleted.");
      const updated = await getReservations();
      if (updated.success) {
        setReservations(updated.data.data);
      }
    } else {
      setErrorMsg(error || "Error while deleting reservation.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="reservations-container">
        <h2 className="center-text">Reservations</h2>

        {loading && <p>⏳ Loading...</p>}
        {error && <p className="reservation-error">{error}</p>}
        {success && <p className="reservation-success">{success}</p>}
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
            <option value="overnattningslagenhet">Guest apartment</option>
            <option value="takterras">Rooftop terrace</option>
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

        <ul style={{ listStyle: "none", padding: 0 }}>
          {reservations.map((res) => (
            <li key={res.id} className="reservation-item">
              <strong>{res.userName || "Unknown"} (Apt. {res.apartmentNumber || "?"})</strong>
              <div className="reservation-date">Date: {res.date}</div>
              <div className="reservation-type">
                Reserved for: {res.type === "overnattningslagenhet" ? "Guest apartment" : "Rooftop terrace"}
              </div>
              <div><a href={`mailto:${res.user}`}>Contact</a></div>
              {res.user === localStorage.getItem("userEmail") && (
                <button
                  onClick={() => handleDelete(res.id)}
                  className="reservation-delete-button"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reservations;
