import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapDisplay.module.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

function MapDisplay({ location, userLocation, selectedItinerary }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [location.lat, location.lng],
        zoom: 13,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (mapRef.current) {
      let mainIcon = L.icon({
        iconUrl:
          "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });

      let itineraryIcon = L.icon({
        iconUrl:
          "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });

      L.Marker.prototype.options.icon = mainIcon;

      mapRef.current.setView([location.lat, location.lng]);
      L.marker([location.lat, location.lng], { icon: mainIcon }).addTo(
        mapRef.current
      );

      if (userLocation) {
        mapRef.current.setView([userLocation.lat, userLocation.lng]);
        L.marker([userLocation.lat, userLocation.lng], {
          icon: mainIcon,
        }).addTo(mapRef.current);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location, userLocation]);

  useEffect(() => {
    if (mapRef.current && selectedItinerary) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      let itineraryIcon = L.icon({
        iconUrl:
          "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });

      markerRef.current = L.marker(
        [selectedItinerary.latitude, selectedItinerary.longitude],
        { icon: itineraryIcon }
      ).addTo(mapRef.current);

      mapRef.current.setView(
        [selectedItinerary.latitude, selectedItinerary.longitude],
        13
      );
    } else if (mapRef.current && markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      mapRef.current.setView([location.lat, location.lng], 13);
    }
  }, [selectedItinerary, location]);

  return <div ref={mapContainerRef} className={styles.mapContainer} />;
}

export default MapDisplay;
