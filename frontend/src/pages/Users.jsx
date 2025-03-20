import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data.data);
        } else {
          setErrorMsg(data.message || "Error fetching users.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorMsg("Network error.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Residents List</h2>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        {users.length === 0 && <p>No registered users.</p>}
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>Email:</strong> {user.Username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "1rem",
  },
  error: {
    color: "red",
  },
};

export default Users;
