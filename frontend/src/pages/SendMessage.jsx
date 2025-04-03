import { useState } from "react";
import { sendMessage } from "../api/messages";
import Navbar from "../components/Navbar";
import "../styles/SendMessage.css";

const SendMessage = () => {
  const [toEmail, setToEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("");

    const from = localStorage.getItem("userEmail");
    if (!from) {
      setStatus("Niste logovani.");
      return;
    }

    const { success, error } = await sendMessage({ from, to: toEmail, message });

    if (success) {
      setStatus("✅ Poruka poslana.");
      setToEmail("");
      setMessage("");
    } else {
      setStatus(`❌ ${error || "Greška."}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="send-container">
        <h2 className="send-title">Pošalji poruku</h2>
        {status && <p className="send-status">{status}</p>}
        <form onSubmit={handleSend} className="send-form">
          <input
            name="toEmail"
            type="email"
            placeholder="Email primatelja"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
            className="send-input"
          />
          <textarea
            name="message"
            placeholder="Poruka"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="send-textarea"
          />
          <button type="submit" className="send-button">Pošalji</button>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
