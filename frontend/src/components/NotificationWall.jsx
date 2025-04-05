// NotificationWall.jsx
import { useEffect, useState } from "react";
import PostNotification from "../pages/PostNotification";

const NotificationWall = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setNotifications(data.data || []);
      } else {
        setError(data.message || "Failed to load notifications.");
      }
    } catch (err) {
      setError("Network error while loading notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete notification by ID
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this notification?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="center-text">Notifications</h2>
      {error && <p className="error">{error}</p>}

      <ul>
        {notifications.map((note) => (
          <li key={note.id} className="notification-item">
            <h3>{note.title}</h3>
            <p>{note.message}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            {note.userId === localStorage.getItem("userEmail") && (
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => setEditingNote(note)}>Edit</button>
                <button onClick={() => handleDelete(note.id)} style={{ marginLeft: "0.5rem" }}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <PostNotification
        editingNote={editingNote}
        onDone={() => {
          setEditingNote(null);
          fetchNotifications();
        }}
      />
    </div>
  );
};

export default NotificationWall;
