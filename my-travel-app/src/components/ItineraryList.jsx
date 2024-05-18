import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { Scrollbars } from "react-custom-scrollbars";
import styles from "./ItineraryList.module.css";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import defaultImage from '../../logo.png';

function ItineraryList({
  cityFileName,
  cityName,
  onItinerarySelect,
  nearbyLocations,
}) {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uniqueTags, setUniqueTags] = useState([]);
  const scrollbarsRef = useRef(null);

  const clearAllFilters = () => {
    setSelectedTags([]);
  };

  const handleItineraryClick = (itinerary) => {
    console.log("Clicked on itinerary:", itinerary);
    console.log("Is itinerary selected:", itinerary.id === selectedItinerary?.id);
    console.log("selected itinerary before:", selectedItinerary);
    setSelectedItinerary(prevSelectedItinerary =>
      prevSelectedItinerary && prevSelectedItinerary.id === itinerary.id ? null : itinerary
    );
    console.log("Selected itinerary:", selectedItinerary);
    onItinerarySelect(
      itinerary.id === selectedItinerary?.id ? null : itinerary
    );
  };

  function getNearbyList() {
    console.log("Loading data from nearby.csv...");
    const filePath = `/nearby.csv`;
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: function (results) {
        console.log("Nearby locations data loaded:", results.data);
        const uniqueCoordinates = new Set(); // Keep track of unique coordinates
        const nearbyItineraries = [];
        results.data.forEach((itinerary) => {
          const latitude = itinerary.Latitude;
          const longitude = itinerary.Longitude;
          const coordinates = `${latitude},${longitude}`;
          const isValidItinerary =
            latitude &&
            longitude &&
            itinerary.Name &&
            itinerary.Address &&
            itinerary.City &&
            itinerary.State &&
            itinerary.Type;
  
          if (isValidItinerary && !uniqueCoordinates.has(coordinates)) {
            // Check if coordinates are unique and itinerary is valid
            nearbyItineraries.push({
              id: itinerary["Index"],
              title: itinerary.Name,
              address: itinerary.Address,
              city: itinerary.City,
              state: itinerary.State,
              description: itinerary.Type,
              rating: itinerary.Rating,
              totalRatings: itinerary["Total Ratings"],
              latitude: latitude,
              longitude: longitude,
              iconUrl: itinerary["Icon URL"],
              tags: getTags(itinerary),
            });
            uniqueCoordinates.add(coordinates); // Add coordinates to set
          }
        });
        console.log("Nearby itineraries:", nearbyItineraries);
        setItineraries(nearbyItineraries);
      },
      error: function (err) {
        console.error("Error loading nearby locations data:", err);
        setItineraries([]);
      },
    });
  }
  
  
  
  
  

  useEffect(() => {
    if (cityFileName) {
      console.log("Loading data from all_cities_top_places.csv...");
      const filePath = `/all_cities_top_places.csv`;
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function (results) {
          console.log("All cities data loaded:", results.data);
          const filteredItineraries = results.data
            .filter((itinerary) => itinerary.City === cityName)
            .map((itinerary) => ({
              id: itinerary["Place ID"],
              title: itinerary.Name,
              address: itinerary.Address,
              city: itinerary.City,
              state: itinerary.State,
              description: itinerary.Type,
              rating: itinerary.Rating,
              totalRatings: itinerary["Total Ratings"],
              latitude: itinerary.Latitude,
              longitude: itinerary.Longitude,
              iconUrl: itinerary["Icon URL"],
              tags: getTags(itinerary),
            }));
          console.log("Filtered itineraries:", filteredItineraries);
          setItineraries(filteredItineraries);
        },
        error: function (err) {
          console.error("Error loading itinerary data:", err);
          setItineraries([]);
        },
      });
    } else if (nearbyLocations) {
      console.log("Using nearby locations:", nearbyLocations);
      getNearbyList();
    } else {
      getNearbyList();
    }
  }, [cityFileName, cityName, nearbyLocations]);

  const getTags = (itinerary) => {
    const types = (itinerary.Type || '').split(", ").filter(
      (type) => type !== "Point Of Interest" && type !== "Establishment"
    );
    return types.map((type) => type.trim());
  };

  useEffect(() => {
    if (itineraries.length > 0) {
      const newUniqueTags = [
        ...new Set(itineraries.flatMap((itinerary) => itinerary.tags)),
      ];
      setUniqueTags(newUniqueTags);
    }
    console.log("Itineraries updated:", itineraries);
  }, [itineraries]);

  useEffect(() => {
    if (selectedItinerary && scrollbarsRef.current) {
      console.log("Selected itinerary:", selectedItinerary);
      const selectedCard = document.querySelector(
        `.${styles.itineraryCard}.${styles.selected}`
      );
      if (selectedCard) {
        console.log("Scrolling to selected itinerary...");
        const cardRect = selectedCard.getBoundingClientRect();
        const scrollbarsRect =
          scrollbarsRef.current.view.getBoundingClientRect();
        scrollbarsRef.current.view.scrollTop =
          selectedCard.offsetTop -
          scrollbarsRect.height / 2 +
          cardRect.height / 2;
      }
    }
  }, [selectedItinerary]);

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredItineraries = selectedTags.length
    ? itineraries.filter((itinerary) =>
        selectedTags.every((tag) => itinerary.tags.includes(tag))
      )
    : itineraries;

  const getTagCount = (tag) => {
    return itineraries.filter((itinerary) => itinerary.tags.includes(tag))
      .length;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.itineraryList}>
      <Scrollbars style={{ width: "100%", height: "100%" }} ref={scrollbarsRef}>
        <div className={styles.itineraryCards}>
          {filteredItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className={`${styles.itineraryCard} ${
                selectedItinerary?.id === itinerary.id ? styles.selected : ""
              }`}
              onClick={() => handleItineraryClick(itinerary)}
            >
              <div className={styles.cardHeader}>
                <img
                  src={itinerary.iconUrl || defaultImage} // Render default image if iconUrl is not available
                  alt="Location Icon"
                  className={styles.iconStyle}
                />
                <div>
                  <h3>{itinerary.title}</h3>
                  <p className={styles.itineraryAddress}>{itinerary.address}</p>
                  {itinerary.rating && (
                    <p className={styles.itineraryRating}>
                      Rating: {itinerary.rating} ({itinerary.totalRatings}{" "}
                      ratings)
                    </p>
                  )}
                </div>
              </div>

              {/* ... */}
            </div>
          ))}
        </div>
      </Scrollbars>
    </div>
  );
}

export default ItineraryList;
