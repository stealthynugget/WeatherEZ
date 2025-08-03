import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SearchHistory from "./components/SearchHistory";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api"; 
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (storedUserId && storedUserName) {
      setIsAuth(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuth(false);
    setUserId(null);
    setUserName(null);
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const city = searchData.label;

    const cityData = {
      userId: userId,
      city: city,
    };

    fetch("http://localhost:4000/searchHistory/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cityData),
    })
      .then(response => response.json())
      .then(data => console.log("City data sent successfully:", data))
      .catch(error => console.error("Error sending city data:", error));

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(console.log);
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">WeatherEZ</div>
          <div className="navbar-links">
            {isAuth ? (
              <>
                <Link to="/search-history">Search History</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuth} setUserId={setUserId} setUserName={setUserName} />} />
          <Route path="/signup" element={<Signup setAuth={setIsAuth} setUserId={setUserId} setUserName={setUserName} />} />
          <Route path="/weather" element={
            isAuth ? (
              <>
                <Search onSearchChange={handleOnSearchChange} />
                {currentWeather && <CurrentWeather data={currentWeather} />}
                {forecast && <Forecast data={forecast} />}
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/search-history" element={
            isAuth ? (
              <SearchHistory userId={userId} />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="*" element={<Navigate to={isAuth ? "/weather" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
