import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getNotifications } from "../api/notifications";
import useFetchStatus from "../hooks/useFetchStatus";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const { loading, error, start, finish } = useFetchStatus();

  useEffect(() => {
    const fetchNotifications = async () => {
      start();
      const { success: ok, data, error: err } = await getNotifications();

      if (ok) {
        setNotifications(data.data);
        finish();
      } else {
        finish({ errorMessage: err || "Greška" });
      }
    };

    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container" style={styles.container}>
        <h2 className="center-text">Notifications</h2>

        {loading && <p>⏳ Učitavanje...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {notifications.length === 0 && !loading && <p>No notifications.</p>}

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
  container: { maxWidth: "600px", margin: "auto", padding: "1rem" },
  error: { color: "red" },
};

export default Dashboard;
