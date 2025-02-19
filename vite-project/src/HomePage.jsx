import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HomePage.css";

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

  const API_KEY = "4c6590ca4dbbf9d48996634a8e89e253"; 

const fetchWeather = async () => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Paris&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement de la météo");
    }
    const data = await response.json();
    setWeather(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


    fetchWeather();
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre plateforme</h1>
      <p>Découvrez notre boutique en ligne et testez vos connaissances en drapeaux !</p>
      <div className="buttons">
        <Link to="/store" className="button">Aller à la boutique</Link>
        <Link to="/flagquiz" className="button">Quiz des Drapeaux</Link>
        <Link to ="/todo" className="button">Todo App</Link>
        <Link to ="/geoguess" className="button">GeoGuess</Link>
        <Link to ="/favoritegeo" className="button">FavoriteGeo</Link>
      </div>
      <div className="weather-box">
        {loading ? (
          <p>Chargement de la météo...</p>
        ) : error ? (
          <p>Erreur : {error}</p>
        ) : (
          <div>
            <h2>Météo à {weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p>Température : {weather.main.temp}°C</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;