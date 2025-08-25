let map = L.map('map').setView([39.5, -98.35], 4); // Center USA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function fetchOSMATMs(lat, lon) {
  const query = `[out:json][timeout:25];
    node["amenity"="atm"](around:5000,${lat},${lon});
    out;`;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });

  const data = await response.json();
  return data.elements.map(atm => ({
    lat: atm.lat,
    lon: atm.lon,
    name: atm.tags.name || "ATM",
    operator: atm.tags.operator || "Unknown",
    brand: atm.tags.brand || "Generic"
  }));
}

async function loadATMs(lat, lon) {
  const atms = await fetchOSMATMs(lat, lon);

  atms.forEach(atm => {
    let popup = `<b>${atm.name}</b><br>Operator: ${atm.operator}<br>Brand: ${atm.brand}`;
    if (/allpoint|moneypass/i.test(atm.operator + atm.brand)) {
      popup += "<br><span style='color:green'>Possible fee-free ATM (verify in app)</span>";
    }

    L.marker([atm.lat, atm.lon]).addTo(map).bindPopup(popup);
  });
}

async function searchCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&countrycodes=us&format=json`);
  const data = await res.json();
  if (data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    map.setView([lat, lon], 13);
    loadATMs(lat, lon);
  } else {
    alert("City not found.");
  }
}

function locateMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      map.setView([lat, lon], 14);
      loadATMs(lat, lon);
    }, err => alert("Unable to get location."));
  }
}
