import { useState } from "react";
import { sendMessage } from "../api/messages";

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
      setStatus("Poruka poslana.");
      setToEmail("");
      setMessage("");
    } else {
      setStatus(error || "Greška.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Pošalji poruku</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSend} style={styles.form}>
        <input
          name="toEmail"
          type="email"
          placeholder="Email primatelja"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          name="message"
          placeholder="Poruka"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Pošalji</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "500px", margin: "auto", padding: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.5rem", fontSize: "1rem" },
  textarea: { padding: "0.5rem", fontSize: "1rem", height: "100px" },
  button: { padding: "0.5rem", fontSize: "1rem", background: "#4CAF50", color: "#fff", border: "none" },
};

export default SendMessage;
