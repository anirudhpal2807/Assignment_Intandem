<<<<<<< HEAD
# Map Pinboard Application

This project is a user-friendly web app that lets you mark locations on a map, add personal notes, and keep track of places that matter to you. It leverages [Leaflet.js](https://leafletjs.com/) for interactive mapping and uses only client-side technologies for a fast, private experience.

## Key Capabilities

- **Map Exploration**: Navigate a global map interface using OpenStreetMap tiles.
- **Location Marking**: Click on any spot to place a marker and jot down a note about the location.
- **Personal Notes**: Attach comments or reminders to each saved place.
- **Automatic Address Lookup**: The app fetches and displays the address for each marker using the Nominatim service.
- **Organized Pin List**: All your saved locations are shown in a sidebar for easy access and management.
- **Remove Locations**: Delete any marker and its note from your collection with a single click.
- **Data Persistence**: Your pins and notes are stored in your browser, so they remain available even after closing the app.
- **Mobile-Ready Design**: The interface adapts smoothly to both desktop and mobile screens.

## Quick Preview

To see the app in action, simply open `index.html` in your preferred web browser.

## How to Use Locally

### Requirements
- [Node.js](https://nodejs.org/) (only needed if you want to run a local server)

### Steps
1. Download or clone this repository to your computer.
2. Install the required package for serving files locally:
   ```bash
   npm install
   ```
3. Launch the local server:
   ```bash
   npm start
   ```
   This will use the `serve` package to host the app.
4. Open your browser and go to the address shown in your terminal (usually [http://localhost:3000](http://localhost:3000)).

> **Note:** Opening `index.html` directly works for most features, but some browsers may restrict address lookups unless run from a server.

## How It Works

- **Adding a Pin**: Click anywhere on the map. A dialog will appear for you to enter a note. Save it to add the pin to your list.
- **Viewing Pins**: All saved locations are listed in the sidebar. Click any entry to focus the map on that spot.
- **Jump to Location**: Use the navigation button next to each pin to quickly zoom in.
- **Deleting Pins**: Remove any saved location using the delete button.
- **Sidebar Controls**: Collapse or expand the sidebar to maximize your map view.

## File Overview

- `index.html` – The main HTML file containing the map and sidebar layout.
- `script.js` – Handles all map interactions, pin management, and data storage.
- `style.css` – Provides the visual styling for the app.
- `package.json` – Contains project metadata and scripts for local development.

## Technical Insights

- **Mapping**: Uses Leaflet.js (via CDN) for rendering and interacting with the map.
- **Tiles**: Map visuals are provided by OpenStreetMap.
- **Address Retrieval**: Uses the Nominatim API to convert coordinates to readable addresses.
- **Storage**: All data is kept in the browser's `localStorage` under the key `savedPins`.
- **No Server Needed**: The app is fully client-side; no backend is required.

## Customization Tips

- To change the map's initial view, edit the coordinates in `script.js`:
  ```js
  let map = L.map('map').setView([0, 0], 2); // [latitude, longitude], zoom level
  ```
- To use a different map tile provider, update the `L.tileLayer` URL in `script.js`.

## License

Distributed under the ISC License. See `package.json` for details.

---

*Crafted with care using Leaflet.js and OpenStreetMap.* 
=======
# Assignment_Intandem
>>>>>>> 83f6d63b3c2cb0663064885c12a5143aa2679ec0
