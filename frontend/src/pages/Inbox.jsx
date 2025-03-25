import { useEffect, useState } from "react";
import { getMessages } from "../api/messages";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setErrorMsg("Niste logovani.");
        return;
      }

      const { success, data, error } = await getMessages(email);

      if (success) {
        setMessages(Array.isArray(data?.data) ? data.data : []);
      } else {
        setErrorMsg(error || "Greška.");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Primljene poruke</h2>
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      {messages.length === 0 && <p>Nema poruka.</p>}
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            <strong>Od: {msg.from}</strong><br />
            {msg.message}<br />
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "1rem" },
  error: { color: "red" },
};

export default Inbox;
