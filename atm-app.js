// Leaflet map setup
const map = L.map('map').setView([39.8283, -98.5795], 4); // Center USA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function loadATMsInView() {
  const bounds = map.getBounds();
  const query = `
    [out:json][timeout:25];
    node["amenity"="atm"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    out;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });
    const data = await response.json();

    data.elements.forEach(atm => {
      let popup = `<b>${atm.tags.name || "ATM"}</b><br>Operator: ${atm.tags.operator || "Unknown"}<br>Brand: ${atm.tags.brand || "Generic"}`;
      if (/allpoint|moneypass/i.test((atm.tags.operator || "") + (atm.tags.brand || ""))) {
        popup += "<br><span style='color:green'>Possible fee-free ATM (verify in app)</span>";
      }
      L.marker([atm.lat, atm.lon]).addTo(map).bindPopup(popup);
    });
  } catch (err) {
    console.error("Error fetching ATMs:", err);
  }
}

// Trigger load whenever map moves
map.on("moveend", loadATMsInView);

// Initial load
loadATMsInView();
