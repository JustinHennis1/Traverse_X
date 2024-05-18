import React, { useState, useEffect } from "react";
import MapDisplay from "./MapDisplay";
import ItineraryList from "./ItineraryList";
import AirbnbList from "./AirbnbList";
import styles from "./Body.module.css";

function Body({ location, airbnbFile, cityName, nearbyLocations }) {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isAirbnbExpanded, setIsAirbnbExpanded] = useState(false);

  const handleItinerarySelect = (itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const toggleAirbnbExpansion = () => {
    setIsAirbnbExpanded(!isAirbnbExpanded);
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.mapAndAirbnbSection}>
        <div
          className={`${styles.mapSection} ${
            isAirbnbExpanded ? styles.mapSectionClose : ""
          }`}
        >
          <MapDisplay location={location} selectedItinerary={selectedItinerary} />
        </div>
        
        <button onClick={toggleAirbnbExpansion}>
        {isAirbnbExpanded ? "Collapse Airbnb List" : "Expand Airbnb List"}
      </button>
          <div
            className={`${styles.airbnbSection} ${
              isAirbnbExpanded ? styles.airbnbSectionExpanded : ""
            }`}
          >
            <AirbnbList
              cityFileName={airbnbFile}
              isExpanded={isAirbnbExpanded}
              toggleExpansion={toggleAirbnbExpansion}
            />
          </div>
      </div>
      <div className={`${styles.itinerarySection} ${
            isAirbnbExpanded ? styles.itinerarySectionmoved : ""
          }`}>
        <ItineraryList
          cityFileName={airbnbFile}
          cityName={cityName}
          onItinerarySelect={handleItinerarySelect}
          nearbyLocations={nearbyLocations}
        />
      </div>
    </div>
  );
}

export default Body;
