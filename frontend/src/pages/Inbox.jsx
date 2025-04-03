import { useEffect, useState } from "react";
import { getMessages } from "../api/messages";
import Navbar from "../components/Navbar";
import "../styles/Inbox.css";

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
    <div>
      <Navbar />
      <div className="inbox-container">
        <h2 className="inbox-title">Primljene poruke</h2>
        {errorMsg && <p className="inbox-error">{errorMsg}</p>}
        {!errorMsg && messages.length === 0 && (
          <p className="inbox-empty">Nema poruka.</p>
        )}
        <ul style={{ padding: 0, listStyle: "none" }}>
          {messages.map((msg) => (
            <li key={msg.id} className="message-card">
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

export default Inbox;
