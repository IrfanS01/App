// PostNotification.jsx
import { useState, useEffect } from "react";

const PostNotification = ({ editingNote, onDone }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setMessage(editingNote.message);
    } else {
      setTitle("");
      setMessage("");
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const token = localStorage.getItem("token");

    const payload = {
      title,
      message,
      userId: localStorage.getItem("userEmail"),
      fullName: localStorage.getItem("fullName"),
      apartmentNumber: localStorage.getItem("apartmentNumber"),
    };

    const method = editingNote ? "PUT" : "POST";
    const endpoint = editingNote
      ? `/notifications/${editingNote.id}`
      : "/notifications";

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus("Notification sent!");
        setTitle("");
        setMessage("");
        onDone?.();
      } else {
        setStatus(data.message || "Error while sending notification.");
      }
    } catch (error) {
      setStatus("Network error.");
    }
  };

  return (
    <div className="container">
      <h3>{editingNote ? "Edit notification" : "New notification"}</h3>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="textarea"
        />
        <button type="submit" className="button">
          {editingNote ? "Save changes" : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default PostNotification;
