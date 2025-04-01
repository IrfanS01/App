import { useState } from "react";
import { sendMessage } from "../api/messages";
import Navbar from "../components/Navbar";
import useFetchStatus from "../hooks/useFetchStatus";

const SendMessage = () => {
  const [toEmail, setToEmail] = useState("");
  const [message, setMessage] = useState("");
  const { loading, error, success, start, finish, reset } = useFetchStatus();

  const handleSend = async (e) => {
    e.preventDefault();
    reset();

    const from = localStorage.getItem("userEmail");
    if (!from) {
      finish({ errorMessage: "Niste logovani." });
      return;
    }

    start();
    const { success: ok, error: err } = await sendMessage({ from, to: toEmail, message });

    if (ok) {
      finish({ successMessage: "Poruka poslana." });
      setToEmail("");
      setMessage("");
    } else {
      finish({ errorMessage: err || "Greška prilikom slanja." });
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Pošalji poruku</h2>

        {loading && <p>⏳ Slanje...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

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
