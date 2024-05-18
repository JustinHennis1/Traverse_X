import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { IconSearch, IconMapPin } from "@tabler/icons-react";
import styles from "./CitySelector.module.css";

function CitySelector({ onCitySelected, onSearchNearby }) {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    Papa.parse("/output.csv", {
      download: true,
      header: true,
      complete: function (results) {
        const statesData = [...new Set(results.data.map((item) => item.State))];
        setStates(statesData);
      },
    });
  }, []);

  useEffect(() => {
    if (selectedState) {
      Papa.parse("/output.csv", {
        download: true,
        header: true,
        complete: function (results) {
          const cityData = results.data.filter(
            (item) => item.State === selectedState
          );
          setCities(cityData);
          setSelectedCity("");
        },
      });
    }
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In the handleSubmit method of CitySelector, after selecting the city:
    const cityData = cities.find((city) => city.City === selectedCity);
    if (cityData) {
      onCitySelected({
        state: selectedState,
        city: cityData.City,
        lat: parseFloat(cityData.Lat),
        lng: parseFloat(cityData.Lng),
        airbnbFile: cityData.filename,
      });
      console.log(cityData.filename);
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>State</label>
          <select
            className={styles.formControl}
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>City</label>
          <select
            className={styles.formControl}
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.City} value={city.City}>
                {city.City}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            type="submit"
            disabled={!selectedCity}
          >
            <IconSearch /> Search
          </button>
          <button
            className={styles.button}
            style={{ marginLeft: "10px" }}
            onClick={onSearchNearby}
            type="button"
          >
            <IconMapPin /> Nearby Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default CitySelector;
