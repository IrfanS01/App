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
      finish({ errorMessage: "Nedostaje info. Prijavite se ponovo." });
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
      finish({ successMessage: "Rezervacija uspješna!" });
      setType("");
      setDate("");
      const updated = await getReservations();
      if (updated.success) {
        setReservations(updated.data.data);
      }
    } else {
      finish({ errorMessage: result.error || "Greška prilikom rezervacije." });
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Jeste li sigurni da želite obrisati rezervaciju?");
    if (!confirm) return;

    const { success, error } = await deleteReservation(id);
    if (success) {
      setMessage("Rezervacija obrisana.");
      const updated = await getReservations();
      if (updated.success) {
        setReservations(updated.data.data);
      }
    } else {
      setErrorMsg(error || "Greška prilikom brisanja.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="reservations-container">
        <h2 className="center-text">Rezervacije</h2>

        {loading && <p>⏳ Učitavanje...</p>}
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
            <option value="">Odaberi tip rezervacije</option>
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

          <button type="submit" className="reservation-button">Rezerviši</button>
        </form>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {reservations.map((res) => (
            <li key={res.id} className="reservation-item">
              <strong>{res.userName || "Nepoznato"} (Stan {res.apartmentNumber || "?"})</strong>
              <div className="reservation-date">Datum: {res.date}</div>
              <div className="reservation-type">Rezervisano: {res.type === "overnattningslagenhet" ? "Övernattningslägenhet" : "Takterras"}</div>
              <div><a href={`mailto:${res.user}`}>Kontakt</a></div>
              {res.user === localStorage.getItem("userEmail") && (
                <button
                  onClick={() => handleDelete(res.id)}
                  className="reservation-delete-button"
                >
                  Obriši
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
