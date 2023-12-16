let startCoords;
let intermediateCoords = [];
let distanceTravelled = 0;

const distanceTravelledDisplay = document.getElementById('distanceTravelled');
const mapDiv = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapDiv);

// ... (previously defined functions)

// ... (previously defined functions)

function startTracking() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        startCoords = position.coords;
        intermediateCoords.push(position.coords);
        document.getElementById('startCoordinates').textContent = `Lat: ${startCoords.latitude}, Lng: ${startCoords.longitude}`;
      }, error => {
        console.error("Error getting the starting location:", error);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function stopTracking() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const endCoords = position.coords;
        intermediateCoords.push(endCoords);
        document.getElementById('stopCoordinates').textContent = `Lat: ${endCoords.latitude}, Lng: ${endCoords.longitude}`;
        distanceTravelled = calculateDistance();
        distanceTravelledDisplay.textContent = distanceTravelled.toFixed(2);
        displayMap();
      }, error => {
        console.error("Error getting the ending location:", error);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  // ... (remaining functions)
  
  // ... (remaining functions)
  



function calculateDistance() {
  let totalDistance = 0;
  for (let i = 0; i < intermediateCoords.length - 1; i++) {
    const lat1 = intermediateCoords[i].latitude;
    const lon1 = intermediateCoords[i].longitude;
    const lat2 = intermediateCoords[i + 1].latitude;
    const lon2 = intermediateCoords[i + 1].longitude;
    totalDistance += distance(lat1, lon1, lat2, lon2);
  }
  return totalDistance;
}



function distance(lat1, lon1, lat2, lon2) {
  // Implementation of Haversine formula to calculate distance between two coordinates
  // Reference: https://en.wikipedia.org/wiki/Haversine_formula
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// ... (previously defined functions)

function calculatePrice(distance, vehicleType) {
  let pricePerKm = 0;
  switch (vehicleType) {
    case 'car':
      pricePerKm = 50;
      break;
    case 'bus':
      pricePerKm = 60;
      break;
    case 'truck':
      pricePerKm = 70;
      break;
    default:
      break;
  }
  return distance * pricePerKm;
}

function stopTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const endCoords = position.coords;
      intermediateCoords.push(endCoords);
      document.getElementById('stopCoordinates').textContent = `Lat: ${endCoords.latitude}, Lng: ${endCoords.longitude}`;
      let distanceTravelled = calculateDistance();
      let selectedVehicleType;
      if (document.getElementById('carCheckbox').checked) {
        selectedVehicleType = 'car';
      } else if (document.getElementById('busCheckbox').checked) {
        selectedVehicleType = 'bus';
      } else if (document.getElementById('truckCheckbox').checked) {
        selectedVehicleType = 'truck';
      }
      let totalPrice = calculatePrice(distanceTravelled, selectedVehicleType);
      distanceTravelledDisplay.textContent = distanceTravelled.toFixed(2);
      document.getElementById('totalPrice').textContent = totalPrice;
      displayMap();
    }, error => {
      console.error("Error getting the ending location:", error);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// ... (remaining functions)


function toRad(deg) {
  return deg * (Math.PI / 180);
}

function displayMap() {
  const pathCoordinates = intermediateCoords.map(coord => ([coord.latitude, coord.longitude]));
  const polyline = L.polyline(pathCoordinates, { color: 'red' }).addTo(mapDiv);
  mapDiv.fitBounds(polyline.getBounds());
}
