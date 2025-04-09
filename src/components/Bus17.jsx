import React, { useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow,
  Polyline
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Bus data for Bus 17
const busData = {
  busNumber: "17",
  driverName: "Gurpreet Singh",
  driverContact: "9876543210",
  capacity: "35 seats",
  type: "AC Express"
};

// Updated bus stops with route from Kharar to Landran through Khuni Majra via Road 205A
const busStops = [
  {
    name: "Mundi Kharar",
    location: { lat: 30.750300501113628, lng: 76.64071199597718 },
    arrivalTime: "06:00 AM",
    departureTime: "06:10 AM",
    isOrigin: true,
    legGroup: 1
  },
  {
    name: "Khuni Majra",
    location: { lat: 30.7278, lng: 76.6667 },
    arrivalTime: "06:25 AM",
    departureTime: "06:28 AM",
    isWaypoint: true,
    legGroup: 1
  },
  {
    name: "Landran Bus Stand",
    location: { lat: 30.6944978, lng: 76.6650876 },
    arrivalTime: "06:40 AM",
    departureTime: "06:45 AM",
    isWaypoint: true,
    legGroup: 1
  },
  {
    name: "ISBT 43",
    location: { lat: 30.71711854736046, lng: 76.74299345914386 },
    arrivalTime: "07:10 AM",
    departureTime: "07:15 AM",
    isDestination: true,
    legGroup: 2
  }
];

// Road 205A path coordinates (simplified approximation)
const road205APath = [
  { lat: 30.750300501113628, lng: 76.64071199597718 }, // Kharar
  { lat: 30.7402, lng: 76.6532 }, // Intermediate point on Road 205A
  { lat: 30.7278, lng: 76.6667 }, // Khuni Majra
  { lat: 30.7120, lng: 76.6645 }, // Another point on Road 205A
  { lat: 30.6944978, lng: 76.6650876 } // Landran
];

// Direct route from Landran to ISBT 43
const directRoutePath = [
  { lat: 30.6944978, lng: 76.6650876 }, // Landran
  { lat: 30.7047, lng: 76.6995 }, // Intermediate point
  { lat: 30.7108, lng: 76.7224 }, // Another intermediate point 
  { lat: 30.71711854736046, lng: 76.74299345914386 } // ISBT 43
];

const Bus17 = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  return (
    <main className="pt-16 px-4">
      {/* Bus Information Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Bus Details</h3>
            <p><span className="font-medium">Bus Number:</span> {busData.busNumber}</p>
            <p><span className="font-medium">Type:</span> {busData.type}</p>
            <p><span className="font-medium">Capacity:</span> {busData.capacity}</p>
            <p><span className="font-medium">Route:</span> Kharar → Khuni Majra → Landran → ISBT 43</p>
            <p><span className="font-medium">Road:</span> 205A from Kharar to Landran</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Driver Information</h3>
            <p><span className="font-medium">Name:</span> {busData.driverName}</p>
            <p><span className="font-medium">Contact:</span> {busData.driverContact}</p>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onLoad={() => setIsLoaded(true)}
          onError={(error) => console.error("Google Maps API loading error:", error)}
        >
          {isLoaded && (
            <GoogleMap 
              mapContainerStyle={containerStyle} 
              center={busStops[0].location} 
              zoom={12}
            >
              {/* Road 205A path with custom styling */}
              <Polyline
                path={road205APath}
                options={{
                  strokeColor: '#0000FF', // Blue color for Road 205A
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
              
              {/* Direct route from Landran to ISBT 43 */}
              <Polyline
                path={directRoutePath}
                options={{
                  strokeColor: '#008000', // Green color for direct route
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                }}
              />
              
              {/* Markers for bus stops */}
              {busStops.map((stop, index) => (
                <Marker
                  key={index}
                  position={stop.location}
                  onClick={() => setSelectedStop(stop)}
                />
              ))}
              
              {/* Info window for selected stop */}
              {selectedStop && (
                <InfoWindow
                  position={selectedStop.location}
                  onCloseClick={() => setSelectedStop(null)}
                >
                  <div>
                    <h3 className="font-bold">{selectedStop.name}</h3>
                    <p>Arrival: {selectedStop.arrivalTime}</p>
                    <p>Departure: {selectedStop.departureTime}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </LoadScript>
      </div>

      {/* Route Information */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Route Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Leg 1: Kharar to Landran via Road 205A (Blue Route)</h3>
            <p>This route follows Road 205A from Kharar through Khuni Majra to reach Landran.</p>
            <p className="text-sm text-gray-600">Road 205A is marked in blue on the map and takes approximately 35 minutes by bus.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-700">Leg 2: Landran to ISBT 43 (Green Route)</h3>
            <p>This is a direct route from Landran to ISBT 43 taking approximately 22 minutes.</p>
            <p className="text-sm text-gray-600">The direct route is marked in green on the map.</p>
          </div>
        </div>
      </div>

      {/* Bus Stops & Schedule Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Stops & Schedule</h2>
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Stop Name</th>
              <th className="py-2 px-4 text-left">Arrival</th>
              <th className="py-2 px-4 text-left">Departure</th>
              <th className="py-2 px-4 text-left">Road</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {busStops.map((stop, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4">{stop.name}</td>
                <td className="py-2 px-4">{stop.arrivalTime}</td>
                <td className="py-2 px-4">{stop.departureTime}</td>
                <td className="py-2 px-4">
                  {index < 3 ? "Road 205A" : "Direct Route"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Bus17;