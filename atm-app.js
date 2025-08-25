// atm-app.js
let map = L.map('map').setView([37.7749, -122.4194], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Example ATM markers
const atms = [
  {name: "Chime ATM", coords: [37.775, -122.418], type: "chime"},
  {name: "PayPal ATM", coords: [37.774, -122.42], type: "paypal"},
  {name: "Cash App ATM", coords: [37.776, -122.417], type: "cashapp"},
  {name: "Apple Pay ATM", coords: [37.777, -122.416], type: "applepay"}
];

const markers = [];
atms.forEach(atm => {
  let color = atm.type === "chime" ? "green" :
              atm.type === "paypal" ? "blue" :
              atm.type === "cashapp" ? "black" :
              "orange";
  let marker = L.marker(atm.coords).addTo(map).bindPopup(atm.name);
  markers.push({marker, type: atm.type});
});

// Filters
document.querySelectorAll('.chip input').forEach(input => {
  input.addEventListener('change', () => {
    markers.forEach(m => {
      const visible = document.getElementById('fltAll').checked ||
        document.getElementById('fltChime').checked && m.type === 'chime' ||
        document.getElementById('fltPayPal').checked && m.type === 'paypal' ||
        document.getElementById('fltCashApp').checked && m.type === 'cashapp' ||
        document.getElementById('fltApplePay').checked && m.type === 'applepay';
      if (visible) map.addLayer(m.marker); else map.removeLayer(m.marker);
    });
  });
});

// Simple search (fly to city)
document.getElementById('go').addEventListener('click', () => {
  let q = document.getElementById('search').value;
  if (!q) return;
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`)
    .then(res => res.json())
    .then(data => {
      if (data[0]) {
        map.flyTo([data[0].lat, data[0].lon], 14);
      }
    });
});
