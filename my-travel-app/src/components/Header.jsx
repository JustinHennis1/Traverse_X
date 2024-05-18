// Header.jsx
import React from "react";
import styles from "./Header.module.css";
import CitySelector from "./CitySelector";

function Header({ onCitySelected, onSearchNearby }) {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <img src="../../../logo.png" alt="Traverse Logo" className={styles.logo} />
        <h1 className={styles.title}>Traverse</h1>
      </div>
      <CitySelector
        onCitySelected={onCitySelected}
        onSearchNearby={onSearchNearby}
      />
    </header>
  );
}

export default Header;
