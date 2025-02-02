/** @jsxImportSource preact */
/// <reference types="chrome" />

import { useState, useEffect } from "preact/hooks";
import icon from "./icon.png";

const Popup = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [spoilersPerPage, setSpoilersPerPage] = useState(0);
  const [totalSpoilers, setTotalSpoilers] = useState(0);

// Load stored values when the popup opens
useEffect(() => {
  chrome.storage.local.get(["spoilersPerPage", "totalSpoilers"], (result) => {
    setSpoilersPerPage(result.spoilersPerPage || 0);
    setTotalSpoilers(result.totalSpoilers || 0);
  });
}, []);

// Function to increase spoiler count (simulated for now)
const increaseSpoilers = () => {
  const newSpoilersPerPage = spoilersPerPage + 1;
  const newTotalSpoilers = totalSpoilers + 1;

  setSpoilersPerPage(newSpoilersPerPage);
  setTotalSpoilers(newTotalSpoilers);

  // Store updated values in Chrome Storage
  chrome.storage.local.set({ spoilersPerPage: newSpoilersPerPage, totalSpoilers: newTotalSpoilers });
};

  return (
    <div class="popup-container">
      {/* Logo and Title */}
      <div class="popup-header">
        <img src={icon} alt="PlotArmor Logo" class="popup-logo" />
        <h1 class="popup-title">
          <span class="plot-text">Plot</span>Armor
        </h1>
      </div>

      {/* Spoiler Block Info */}
      <p class="popup-info">
        Never see spoilers again with <span class="bold-text">PlotArmor</span>.
      </p>

      <p class="popup-stats">
        <span class="bold-text">{spoilersPerPage}</span> spoilers blocked on this page.
      </p>

      <p class="popup-stats">
        <span class="bold-text">{totalSpoilers}</span> spoilers blocked in total.
      </p>

      {/* Pause Button */}
      <button
        class={`popup-button ${isPaused ? "paused" : ""}`}
        onClick={() => {
          setIsPaused(!isPaused);
          increaseSpoilers();
        }}
      >
        {isPaused ? "▶ Resume" : "⏸ Pause"}
      </button>
    </div>
  );
};

export default Popup;