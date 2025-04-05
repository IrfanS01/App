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
      setStatus("You are not logged in.");
      return;
    }

    const { success, error } = await sendMessage({ from, to: toEmail, message });

    if (success) {
      setStatus("✅ Message sent.");
      setToEmail("");
      setMessage("");
    } else {
      setStatus(`❌ ${error || "Error sending message."}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="send-container">
        <h2 className="send-title">Send Message</h2>
        {status && <p className="send-status">{status}</p>}
        <form onSubmit={handleSend} className="send-form">
          <input
            name="toEmail"
            type="email"
            placeholder="Recipient's email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
            className="send-input"
          />
          <textarea
            name="message"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="send-textarea"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
