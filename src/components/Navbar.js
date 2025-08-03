import { Link } from "react-router-dom";
import "./Navbar.css"; // Create this file for custom styles

const Navbar = ({ isAuth, onLogout }) => {
  return (
    <nav className="navbar">
      <h1>WeatherEz</h1>
      <div>
        {isAuth ? (
          <>
            <Link to="/weather">Weather</Link>
            <Link to="/search-history">Search History</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
