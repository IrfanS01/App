import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUsers } from "../api/users";
import useFetchStatus from "../hooks/useFetchStatus";
import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { loading, error, success, start, finish } = useFetchStatus();

  useEffect(() => {
    const fetchUsers = async () => {
      start();

      const { success: ok, data, error: err } = await getUsers();

      if (ok) {
        setUsers(Array.isArray(data?.data) ? data.data : []);
        finish({ successMessage: "Users loaded: " + data.data.length });
      } else {
        finish({ errorMessage: err || "Error loading users." });
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <div className="users-container">
        <h2 className="users-title">Resident List</h2>

        {loading && <p>⏳ Loading...</p>}
        {error && <p className="users-error">{error}</p>}
        {success && <p className="users-success">{success}</p>}
        {users.length === 0 && !loading && <p>No registered users.</p>}

        <ul style={{ padding: 0, listStyle: "none" }}>
          {users.map((user, index) => (
            <li key={index} className="user-card">
              <strong>{user.fullName}</strong> (Apt. {user.apartmentNumber})<br />
              Email: {user.email}<br />
              Role: {user.role} | Status: {user.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
