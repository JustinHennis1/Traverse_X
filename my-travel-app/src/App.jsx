import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Body from "./components/Body";
import styles from "./App.module.css";
import Papa from 'papaparse';
import LoadingSpinner from "./components/LoadingSpinner"; 

function App() {
  const [location, setLocation] = useState({ lat: 39.905714, lng: 116.391297 });
  const [airbnbFile, setAirbnbFile] = useState("");
  const [cityName, setCityName] = useState("");
  const [nearbyLocations, setNearbyLocations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    };
  
    fetchUserLocation();
  }, []);
  
  const fetchUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude: ", latitude);
          console.log("Longitude: ", longitude);

          setLocation({
            lat: latitude,
            lng: longitude
          });
          console.log("User location fetched:", { latitude, longitude }); 
          resolve({ latitude, longitude }); // Resolve with latitude and longitude
        },
        (error) => {
          console.error("Error fetching user location:", error);
          reject(error);
        }
      );
    });
  };
  
  const fetchNearbyData = async () => {
    setIsLoading(true); // Set loading state to true before fetching data

    try {
      // Wait for user location to be fetched
      const { latitude, longitude } = await fetchUserLocation();

      // Fetch nearby locations data
      const nearbyResponse = await fetch('http://127.0.0.1:5000/nearbySearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Latitude: latitude, Longitude: longitude })
      });

      // Check if response is okay
      if (!nearbyResponse.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse response data
      await handleSearchNearby();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }
  };
  
  const handleCitySelected = (cityInfo) => {
    setLocation({ lat: cityInfo.lat, lng: cityInfo.lng });
    setAirbnbFile(cityInfo.airbnbFile);
    setCityName(cityInfo.city);
    console.log(cityInfo.airbnbFile);
    console.log(cityInfo.city);
  };
  const getTags = (itinerary) => {
    const types = (itinerary.Type || '').split(", ").filter(
      (type) => type !== "Point Of Interest" && type !== "Establishment"
    );
    return types.map((type) => type.trim());
  };

  const handleSearchNearby = async () => {
    setCityName("");
    setAirbnbFile("");
    const response = await fetch('http://127.0.0.1:5000/nearby.csv', { method: 'GET' });
    const csvData = await response.text();
    console.log("CSV data fetched:", csvData);
    if(csvData){
      setNearbyLocations(true);
    }
  };
  

  return (
    <div className={styles.appContainer}>
      <Header onCitySelected={handleCitySelected} onSearchNearby={fetchNearbyData} />
      {isLoading ? (
        <LoadingSpinner /> // Render the loading spinner component when loading
      ) : (
        <Body
          location={location}
          airbnbFile={airbnbFile}
          cityName={cityName}
          nearbyLocations={nearbyLocations}
        />
      )}
    </div>
  );
}

export default App;
