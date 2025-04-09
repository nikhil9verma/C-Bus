import React, { useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Sample bus data
const busData = {
  busNumber: "PB-35",
  driverName: "Rajinder Singh",
  driverContact: "9876543210",
  capacity: "45 seats",
  type: "AC Express"
};

// Sample bus stops with coordinates and timings
const busStops = [
  {
    name: "Chandigarh Railway Station",
    location: { lat: 30.750300501113628, lng: 76.64071199597718 },
    arrivalTime: "08:00 AM",
    departureTime: "08:10 AM",
    isOrigin: true
  },
  {
    name: "Sector 17 Bus Stand",
    location: { lat: 30.740123, lng: 76.782345 },
    arrivalTime: "08:25 AM",
    departureTime: "08:30 AM"
  },
  {
    name: "PGI Hospital",
    location: { lat: 30.765432, lng: 76.801234 },
    arrivalTime: "08:45 AM",
    departureTime: "08:50 AM"
  },
  {
    name: "Panchkula Bus Terminal",
    location: { lat: 30.71711854736046, lng: 76.74299345914386 },
    arrivalTime: "09:15 AM",
    departureTime: "09:20 AM",
    isDestination: true
  }
];

// Sample alternative routes
const alternativeRoutes = [
  { id: 1, name: "Express Route", duration: "45 mins", stops: 4, fare: "₹30" },
  { id: 2, name: "Local Route", duration: "1 hr 10 mins", stops: 8, fare: "₹25" },
  { id: 3, name: "Night Service", duration: "50 mins", stops: 5, fare: "₹35" }
];

const Bus35 = () => {
  const [directions, setDirections] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(1);
  
  const origin = busStops.find(stop => stop.isOrigin)?.location;
  const destination = busStops.find(stop => stop.isDestination)?.location;

  const calculateRoute = () => {
    if (!window.google || !origin || !destination) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    
    // Create waypoints from bus stops (excluding origin and destination)
    const waypoints = busStops
      .filter(stop => !stop.isOrigin && !stop.isDestination)
      .map(stop => ({
        location: new window.google.maps.LatLng(stop.location.lat, stop.location.lng),
        stopover: true
      }));
    
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded, selectedRoute]);

  return (
    <main className="pt-16 px-4">
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Bus Details</h3>
            <p><span className="font-medium">Bus Number:</span> {busData.busNumber}</p>
            <p><span className="font-medium">Type:</span> {busData.type}</p>
            <p><span className="font-medium">Capacity:</span> {busData.capacity}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Driver Information</h3>
            <p><span className="font-medium">Name:</span> {busData.driverName}</p>
            <p><span className="font-medium">Contact:</span> {busData.driverContact}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Route Options</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {alternativeRoutes.map(route => (
            <button
              key={route.id}
              className={`px-4 py-2 rounded-full ${
                selectedRoute === route.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedRoute(route.id)}
            >
              {route.name}
            </button>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {alternativeRoutes.find(r => r.id === selectedRoute)?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Duration:</span> {alternativeRoutes.find(r => r.id === selectedRoute)?.duration}
            </div>
            <div>
              <span className="font-medium">Stops:</span> {alternativeRoutes.find(r => r.id === selectedRoute)?.stops}
            </div>
            <div>
              <span className="font-medium">Fare:</span> {alternativeRoutes.find(r => r.id === selectedRoute)?.fare}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Stops & Schedule</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Stop Name</th>
                <th className="py-2 px-4 text-left">Arrival</th>
                <th className="py-2 px-4 text-left">Departure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {busStops.map((stop, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4">{stop.name}</td>
                  <td className="py-2 px-4">{stop.arrivalTime}</td>
                  <td className="py-2 px-4">{stop.departureTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <LoadScript
          googleMapsApiKey='AIzaSyAqIyBs3D2G4pvzA-YGSH500mx5AJQI698'
          onLoad={() => setIsLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={origin}
            zoom={12}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#2563eb",
                    strokeWeight: 4,
                  },
                  suppressMarkers: true,
                }}
              />
            )}
            
            {busStops.map((stop, index) => (
              <Marker
                key={index}
                position={stop.location}
                icon={{
                  url: stop.isOrigin || stop.isDestination 
                    ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" 
                    : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
                onClick={() => setSelectedStop(stop)}
              />
            ))}
            
            {selectedStop && (
              <InfoWindow
                position={selectedStop.location}
                onCloseClick={() => setSelectedStop(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{selectedStop.name}</h3>
                  <p className="text-sm">Arrival: {selectedStop.arrivalTime}</p>
                  <p className="text-sm">Departure: {selectedStop.departureTime}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </main>
  );
};

export default Bus35;