import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Icône personnalisée
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const center = [48.8566, 2.3522]; // Paris par défaut

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });
  return null;
};

const FavoriteGeo = () => {
  const [markers, setMarkers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/favorites").then((response) => {
      setFavorites(response.data);
    });
  }, []);

  const handleMapClick = (latlng) => {
    const placeName = prompt("Nom du lieu ?");
    if (!placeName) return;

    axios
      .post("http://localhost:5000/favorites", {
        latitude: latlng.lat,
        longitude: latlng.lng,
        name: placeName,
      })
      .then(() => {
        setMarkers([...markers, { lat: latlng.lat, lng: latlng.lng }]);
        return axios.get("http://localhost:5000/favorites");
      })
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du favori :", error.response?.data || error.message);
        alert("Erreur d'ajout : " + (error.response?.data.error || "Problème inconnu"));
      });
  };

  return (
    <div>
      <h1>Favoris Geo</h1>
      <MapContainer center={center} zoom={5} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onClick={handleMapClick} />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon} />
        ))}
        {favorites.map((fav) => (
          <Marker key={fav.id} position={[fav.latitude, fav.longitude]} icon={customIcon} />
        ))}
      </MapContainer>
    </div>
  );
};

export default FavoriteGeo;
