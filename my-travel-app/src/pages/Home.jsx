import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from "../components/Header";
import CitySelector from "../components/CitySelector";
import MapDisplay from "../components/MapDisplay";
import ItineraryCard from "../components/ItineraryCard";
function retrieveNearbyLocals() {
  const requestData = {
    username: "jhennis1",
    lat: "40.712342",
    lng: "-73.595470",
    featureCode: "BLDG",
    radius: "30",
  };

  fetch("http://127.0.0.1:5000/findNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}
function Home() {
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });

  useEffect(() => {
    // Fetch the city data
    fetch("/path/to/tourist_cities.csv")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error loading city data:", error));
  }, []);

  const handleCitySelected = (cityInfo) => {
    console.log("Selected city:", cityInfo);
    // Update location based on selected city
    // This should be updated with real latitude and longitude from your backend or another source
  };

  return (
    <div className="app-bg">
      <div style={{ height: "100px" }}></div>
      <div style={{ textAlign: "left" }}>
        <CitySelector cities={cities} onCitySelected={handleCitySelected} />
      </div>
      <div className="p-5">
        <MapDisplay location={location} />
      </div>
      <button className="btn btn-primary" onClick={retrieveNearbyLocals}>
        {" "}
        Get Nearby Locations
      </button>
      {/* Placeholder data for ItineraryCard */}
      <ItineraryCard
        item={{
          title: "Brandenburg Gate",
          description: "Iconic 18th-century gate",
          imageUrl: "https://example.com/image.jpg",
        }}
      />
    </div>
  );
}

export default Home;
