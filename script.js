// Set up the interactive map with a world view
const leafletMap = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(leafletMap);

// Retrieve saved locations or initialize empty array
let locationData = JSON.parse(localStorage.getItem('savedPins')) || [];
let markerRefs = [];

// Display all saved locations in the sidebar and on the map
function updateLocationSidebar() {
    const sidebarList = document.getElementById('pin-list');
    const countDisplay = document.getElementById('pin-count');
    sidebarList.innerHTML = '';
    if (countDisplay) {
        countDisplay.textContent = locationData.length === 1 ? '1 location saved' : `${locationData.length} locations saved`;
    }
    if (locationData.length === 0) {
        sidebarList.innerHTML = '<p style="color:#888;">No locations saved</p>';
        return;
    }
    locationData.forEach((entry, idx) => {
        const entryCard = document.createElement('div');
        entryCard.className = 'pin-card';

        // Coordinates
        const coordRow = document.createElement('div');
        coordRow.className = 'pin-coords';
        coordRow.innerHTML = `<span style="font-size:1.2em; color:#d32f2f;">&#11044;</span> ${Number(entry.lat).toFixed(4)}, ${Number(entry.lng).toFixed(4)}`;
        entryCard.appendChild(coordRow);

        // Action buttons
        const actionRow = document.createElement('div');
        actionRow.className = 'pin-actions';
        // Zoom button
        const zoomBtn = document.createElement('button');
        zoomBtn.className = 'pin-action-btn';
        zoomBtn.title = 'Zoom to location';
        zoomBtn.innerHTML = '&#9992;';
        zoomBtn.onclick = (e) => {
            e.stopPropagation();
            leafletMap.setView([entry.lat, entry.lng], 15);
            L.marker([entry.lat, entry.lng]).addTo(leafletMap).bindPopup(entry.remark).openPopup();
        };
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'pin-action-btn';
        removeBtn.title = 'Remove location';
        removeBtn.innerHTML = '&#128465;';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            if (markerRefs[idx]) {
                leafletMap.removeLayer(markerRefs[idx]);
                markerRefs.splice(idx, 1);
            }
            locationData.splice(idx, 1);
            localStorage.setItem('savedPins', JSON.stringify(locationData));
            updateLocationSidebar();
        };
        actionRow.appendChild(zoomBtn);
        actionRow.appendChild(removeBtn);
        entryCard.appendChild(actionRow);

        // Remark
        const noteDiv = document.createElement('div');
        noteDiv.className = 'pin-remark';
        noteDiv.innerHTML = entry.remark ? `<span style="font-size:1.1em;">&#128172;</span> ${entry.remark}` : '';
        entryCard.appendChild(noteDiv);

        // Address
        const addressDiv = document.createElement('div');
        addressDiv.style.fontSize = '0.98em';
        addressDiv.style.color = '#555';
        addressDiv.textContent = entry.address || 'Fetching...';
        entryCard.appendChild(addressDiv);

        // Date
        const dateDiv = document.createElement('div');
        dateDiv.className = 'pin-date';
        if (entry.date) {
            dateDiv.textContent = new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
        entryCard.appendChild(dateDiv);

        // Card click: zoom to location
        entryCard.style.cursor = 'pointer';
        entryCard.onclick = (e) => {
            if (e.target.closest('.pin-action-btn')) return;
            leafletMap.setView([entry.lat, entry.lng], 15);
            L.marker([entry.lat, entry.lng]).addTo(leafletMap).bindPopup(entry.remark).openPopup();
        };

        sidebarList.appendChild(entryCard);
    });
}

// Place all saved markers on the map
markerRefs = [];
locationData.forEach(entry => {
    const marker = L.marker([entry.lat, entry.lng]).addTo(leafletMap).bindPopup(entry.remark);
    markerRefs.push(marker);
});
updateLocationSidebar();

// Add a new pin when the map is clicked
leafletMap.on('click', async (event) => {
    const { lat, lng } = event.latlng;
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());

    // Modal overlay
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'modal-overlay';

    // Modal content
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal-card';

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `<span class='modal-header-icon'>&#128205;</span> Mark New Location`;
    // Close button
    const closeModalBtn = document.createElement('button');
    closeModalBtn.className = 'modal-close-btn';
    closeModalBtn.innerHTML = '&times;';
    closeModalBtn.onclick = () => overlayDiv.remove();
    modalDiv.appendChild(modalHeader);
    modalDiv.appendChild(closeModalBtn);

    // Coordinates display
    const coordsDisplay = document.createElement('div');
    coordsDisplay.className = 'modal-location';
    coordsDisplay.textContent = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    modalDiv.appendChild(coordsDisplay);

    // Remark label
    const noteLabel = document.createElement('div');
    noteLabel.className = 'modal-label';
    noteLabel.textContent = 'Notes (Optional)';
    modalDiv.appendChild(noteLabel);

    // Remark textarea
    const noteArea = document.createElement('textarea');
    noteArea.className = 'modal-textarea';
    noteArea.placeholder = 'Write something about this place...';
    modalDiv.appendChild(noteArea);

    // Modal actions
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';
    // Save
    const saveLocationBtn = document.createElement('button');
    saveLocationBtn.className = 'modal-save-btn';
    saveLocationBtn.innerHTML = '<span style="font-size:1.1em;">&#128190;</span> Save';
    // Cancel
    const cancelLocationBtn = document.createElement('button');
    cancelLocationBtn.className = 'modal-cancel-btn';
    cancelLocationBtn.textContent = 'Cancel';
    modalActions.appendChild(saveLocationBtn);
    modalActions.appendChild(cancelLocationBtn);
    modalDiv.appendChild(modalActions);

    overlayDiv.appendChild(modalDiv);
    document.body.appendChild(overlayDiv);
    noteArea.focus();

    // Cancel/close logic
    cancelLocationBtn.onclick = closeModalBtn.onclick = () => overlayDiv.remove();
    overlayDiv.onclick = (e) => { if (e.target === overlayDiv) overlayDiv.remove(); };

    // Save logic
    saveLocationBtn.onclick = async (e) => {
        e.preventDefault();
        const remark = noteArea.value;
        let address = 'Unknown';
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await resp.json();
            address = data.display_name;
        } catch (err) {
            console.error('Could not fetch address:', err);
        }
        const newEntry = { lat, lng, remark, address, date: new Date().toISOString() };
        locationData.push(newEntry);
        localStorage.setItem('savedPins', JSON.stringify(locationData));
        const marker = L.marker([lat, lng]).addTo(leafletMap).bindPopup(remark);
        markerRefs.push(marker);
        updateLocationSidebar();
        overlayDiv.remove();
    };
});

// Sidebar collapse/expand logic
function refreshCollapsedCount() {
    const collapsedCount = document.getElementById('collapsed-pin-count');
    if (collapsedCount) {
        collapsedCount.textContent = locationData.length === 1 ? '1 pin' : `${locationData.length} pins`;
    }
}
function sidebarToggleSetup() {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapsed = document.getElementById('sidebar-collapsed');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const expandBtn = document.getElementById('sidebar-expand');
    if (toggleBtn && sidebar && sidebarCollapsed) {
        toggleBtn.onclick = () => {
            sidebar.classList.remove('sidebar-expanded');
            sidebar.classList.add('sidebar-collapsed');
            sidebar.style.display = 'none';
            sidebarCollapsed.style.display = 'flex';
            refreshCollapsedCount();
        };
    }
    if (expandBtn && sidebar && sidebarCollapsed) {
        expandBtn.onclick = () => {
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            sidebar.style.display = 'block';
            sidebarCollapsed.style.display = 'none';
        };
    }
}
// Initialize sidebar toggle
sidebarToggleSetup();

// Update collapsed pin count whenever the sidebar is refreshed
const originalUpdateSidebar = updateLocationSidebar;
updateLocationSidebar = function() {
    originalUpdateSidebar.apply(this, arguments);
    refreshCollapsedCount();
};
