import { useEffect, useState } from "react";
import { getMessages } from "../api/messages";
import Navbar from "../components/Navbar";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setErrorMsg("Niste logovani.");
        return;
      }

      const { success, data, error } = await getMessages(email);

      if (success) {
        setMessages(Array.isArray(data?.data) ? data.data : []);
      } else {
        setErrorMsg(error || "Greška prilikom dohvaćanja poruka.");
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Primljene poruke</h2>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {messages.length === 0 && !errorMsg && <p>Nema poruka.</p>}

        <ul style={styles.list}>
          {messages.map((msg) => (
            <li key={msg.id} style={styles.message}>
              <strong>Od: {msg.from}</strong>
              <p>{msg.message}</p>
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
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
  list: { listStyle: "none", padding: 0 },
  message: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    backgroundColor: "#f4f4f4",
  },
};

export default Inbox;
