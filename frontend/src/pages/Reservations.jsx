import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReservations, createReservation } from "../api/reservations";
import useFetchStatus from "../hooks/useFetchStatus";

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

  return (
    <div>
      <Navbar />
      <div className="container center-text">
        <h2 className="center-text">Rezervacije</h2>

        {loading && <p>⏳ Učitavanje...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        {message && <p style={styles.success}>{message}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <form onSubmit={handleReservation} className="form" style={styles.form}>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="input"
            style={styles.input}
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
            className="input"
            style={styles.input}
          />

          <button type="submit" className="button" style={styles.button}>Rezerviši</button>
        </form>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {reservations.map((res) => (
            <li key={res.id} className="reservation-card">
              <div>
                <strong>{res.userName || "Nepoznato"} (Stan {res.apartmentNumber || "?"})</strong>
              </div>
              <div>{res.date}</div>
              <div><a href={`mailto:${res.user}`}>Kontakt</a></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  form: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#2196F3",
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

export default Reservations;
