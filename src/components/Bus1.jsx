import React, { useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Coordinates for Delhi Railway Station
const origin = {
  lat: 30.750300501113628, // Latitude for Delhi Railway Station
  lng: 76.64071199597718, // Longitude for Delhi Railway Station
};

// Coordinates for India Gate
const destination = {
  lat: 30.71711854736046, // Latitude for India Gate
  lng: 76.74299345914386, // Longitude for India Gate
};

const Bus3 = () => {
  const [directions, setDirections] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // State to track if the API is loaded

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  // Use useEffect to calculate the route when the component mounts
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  return (
    <main className="pt-16 ml-2 pl-2 mr-2">
      <div className=" ">

      </div>
      <LoadScript
        googleMapsApiKey="AIzaSyAqIyBs3D2G4pvzA-YGSH500mx5AJQI698"
        onLoad={() => setIsLoaded(true)} // Set isLoaded to true when the API is loaded
      >
        <GoogleMap
        className=" p-2"
          mapContainerStyle={containerStyle}
          center={origin} // Center the map on the origin
          zoom={12} // Adjust zoom level as needed
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#2563eb",
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </main>
  );
};

export default Bus3;