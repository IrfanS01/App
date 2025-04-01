import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUsers } from "../api/users";
import useFetchStatus from "../hooks/useFetchStatus";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { loading, error, success, start, finish } = useFetchStatus();

  useEffect(() => {
    const fetchUsers = async () => {
      start();

      const { success: ok, data, error: err } = await getUsers();

      if (ok) {
        setUsers(Array.isArray(data?.data) ? data.data : []);
        finish({ successMessage: "Učitano korisnika: " + data.data.length });
      } else {
        finish({ errorMessage: err || "Greška prilikom učitavanja korisnika." });
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Residents List</h2>
        {loading && <p>⏳ Učitavanje...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        {users.length === 0 && !loading && <p>No registered users.</p>}

        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <strong>{user.fullName}</strong> ({user.apartmentNumber})<br />
              Email: {user.email}<br />
              Uloga: {user.role} | Status: {user.status}
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
  success: { color: "green" },
};

export default Users;
