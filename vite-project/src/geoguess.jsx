import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./geoguess.css";


const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const center = [20, 0];
const MAX_ROUNDS = 10;

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });
  return null;
};

const getDistance = ([lat1, lon1], [lat2, lon2]) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculatePoints = (distance) => {
  if (distance < 100) return 1000;
  if (distance < 500) return 500;
  if (distance < 1000) return 200;
  return 0;
};

const Geoguess = () => {
  const [targetCountry, setTargetCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userGuess, setUserGuess] = useState(null);
  const [distance, setDistance] = useState(null);
  const [guessValidated, setGuessValidated] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [line, setLine] = useState([]);

  const fetchRandomCountry = async () => {
    if (rounds >= MAX_ROUNDS) {
      alert(`Jeu terminé ! Score final : ${score}`);
      saveScore();
      return;
    }
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countries = response.data;
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setTargetCountry(randomCountry);
      setTimeLeft(30);
      setUserGuess(null);
      setDistance(null);
      setGuessValidated(false);
      setRounds(rounds + 1);
      setLine([]);
    } catch (error) {
      console.error("Erreur lors de la récupération des pays :", error);
    }
  };

  const saveScore = async () => {
    const playerName = prompt("Entrez votre nom pour sauvegarder votre score :");
    if (!playerName) return;

    try {
      await axios.post("http://localhost:5000/scores", { player_name: playerName, score });
      alert("Score enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du score :", error);
    }
  };

  useEffect(() => {
    fetchRandomCountry();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Temps écoulé !");
      fetchRandomCountry();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleMapClick = (latlng) => {
    if (!targetCountry || guessValidated) return;
    setUserGuess({ lat: latlng.lat, lng: latlng.lng });
  };

  const validateGuess = () => {
    if (!userGuess || !targetCountry) return;
    const realCoords = targetCountry.latlng;
    const guessedCoords = [userGuess.lat, userGuess.lng];
    const calculatedDistance = getDistance(realCoords, guessedCoords);
    setDistance(calculatedDistance.toFixed(2));
    setScore((prevScore) => prevScore + calculatePoints(calculatedDistance));
    setGuessValidated(true);
    setLine([guessedCoords, realCoords]);
  };

  return (
    <div>
      <h1>GeoGuess Game</h1>
      <h2>Tour : {rounds}/{MAX_ROUNDS}</h2>
      <h2>Devinez : {targetCountry ? targetCountry.name.common : "Chargement..."}</h2>
      <h3>Score : {score}</h3>
      <h3>Temps restant : {timeLeft}s</h3>
      {distance && <h3>Distance : {distance} km</h3>}
      <MapContainer center={center} zoom={3} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onClick={handleMapClick} />
        {userGuess && <Marker position={[userGuess.lat, userGuess.lng]} icon={customIcon} />}
        {guessValidated && <Marker position={targetCountry.latlng} icon={customIcon} />}
        {line.length > 0 && <Polyline positions={line} color="red" dashArray="5,10" />}
      </MapContainer>
      <button onClick={validateGuess} disabled={guessValidated}>Valider</button>
      <button onClick={fetchRandomCountry}>Next</button>
    </div>
  );
};

export default Geoguess;
