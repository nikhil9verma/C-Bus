import React, { useState } from "react";
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const Bus25 = () => {
  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const calculateRoute = () => {
    if (!origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <main className="pt-16 ml-40 pl-2 mr-2">
      <div className="mb-4 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={calculateRoute}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Route
          </button>
        </div>
      </div>
      
      <LoadScript googleMapsApiKey="AIzaSyAqIyBs3D2G4pvzA-YGSH500mx5AJQI698">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#2563eb",
                  strokeWeight: 4
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </main>
  );
};

export default Bus25;