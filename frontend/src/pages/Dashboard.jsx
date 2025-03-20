import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setNotifications(data.data);
        } else {
          setErrorMsg(data.message || "Error fetching notifications.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg("Network error.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Notifications</h2>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {notifications.length === 0 && <p>No notifications.</p>}
        <ul>
          {notifications.map((note) => (
            <li key={note.id}>
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

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "1rem",
  },
  error: {
    color: "red",
  },
};

export default Dashboard;
