import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css"; // ✅ dodaj novi stil

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setNotifications(data.data);
        } else {
          setErrorMsg(data.message || "Greška pri dohvatu obavijesti.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg("Greška u mreži.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Obavještenja</h2>
        {errorMsg && <p className="dashboard-error">{errorMsg}</p>}
        {!errorMsg && notifications.length === 0 && (
          <p className="dashboard-empty">Nema aktivnih obavijesti.</p>
        )}
        <ul style={{ padding: 0, listStyle: "none" }}>
          {notifications.map((note) => (
            <li key={note.id} className="notification-card">
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
