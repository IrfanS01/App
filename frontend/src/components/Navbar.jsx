import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Obriši JWT token
    navigate("/login");               // Vrati korisnika na login stranicu
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/reservations" style={styles.link}>Reservations</Link></li>
        <li><Link to="/users" style={styles.link}>Users</Link></li>
        <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#4CAF50",
    padding: "1rem",
  },
  ul: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;
