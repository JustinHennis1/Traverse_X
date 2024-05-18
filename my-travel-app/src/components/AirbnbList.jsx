import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Scrollbars } from "react-custom-scrollbars";
import styles from "./AirbnbList.module.css";

function AirbnbList({ cityFileName, isExpanded, toggleExpansion }) {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    if (cityFileName) {
      const filePath = `/${cityFileName}`;
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function (results) {
          const filteredAndLimitedData = results.data
            .filter((listing) => parseFloat(listing.review_scores_rating) > 3.9)
            .sort((a, b) => b.review_scores_rating - a.review_scores_rating)
            .slice(0, 30);
          const mappedResults = filteredAndLimitedData.map((listing) => ({
            id: listing.id,
            name: listing.name || "No name provided",
            description:
              listing.neighborhood_overview || "No description available.",
            imageUrl: listing.picture_url || "default-image-url",
            url: listing.listing_url,
          }));
          setListings(mappedResults);
        },
        error: function (err) {
          console.error("Error loading Airbnb data:", err);
          setListings([]);
        },
      });
    } else {
      setListings([]);
    }
  }, [cityFileName]);

  const handleListingClick = (listing) => {
    setSelectedListing(listing.id === selectedListing?.id ? null : listing);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isExpanded) {
        toggleExpansion();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, toggleExpansion]);
  
  return (
    <div className={`${styles.airbnbList} ${isExpanded ? styles.expanded : ""}`}>
      {isExpanded && (
        <button className={styles.closeButton} onClick={toggleExpansion}>
          Close
        </button>
      )}
      <h2 className={styles.airbnbTitle}>Airbnb Listings</h2>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <div className={styles.airbnbCards}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`${styles.airbnbCard} ${
                selectedListing?.id === listing.id ? styles.selected : ""
              }`}
              onClick={() => handleListingClick(listing)}
            >
              <div className={styles.cardContent}>
                <img
                  src={listing.imageUrl}
                  alt={listing.name}
                  className={styles.cardImage}
                />
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>{listing.name}</h3>
                </div>
              </div>
              {selectedListing?.id === listing.id && (
                <div className={styles.expandedDetails}>
                  <p className={styles.cardDescription}>
                    {listing.description}
                  </p>
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Airbnb
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </Scrollbars>
    </div>
  );
}

export default AirbnbList;
