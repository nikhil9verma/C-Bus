import React, { useState, useEffect, useCallback, memo } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  marginBottom: "30px"
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
    isOrigin: true
  },
  {
    name: "Khuni Majra",
    location: { lat: 30.7278, lng: 76.6667 },
    arrivalTime: "06:25 AM",
    departureTime: "06:28 AM"
  },
  {
    name: "Landran Bus Stand",
    location: { lat: 30.6944978, lng: 76.6650876 },
    arrivalTime: "06:40 AM",
    departureTime: "06:45 AM"
  },
  {
    name: "ISBT 43",
    location: { lat: 30.71711854736046, lng: 76.74299345914386 },
    arrivalTime: "07:10 AM",
    departureTime: "07:15 AM",
    isDestination: true
  }
];

// Route options with detailed information
const routeOptions = [
  { 
    id: 1, 
    name: "Via Road 205A", 
    duration: "1 hr 10 mins", 
    stops: 4, 
    fare: "₹25",
    description: "This route follows Road 205A from Kharar through Khuni Majra to reach Landran, then continues to ISBT 43.",
    color: "#0000FF", // Blue
    departureTime: "06:00 AM",
    arrivalTime: "07:10 AM",
    trafficCondition: "Moderate traffic in morning hours",
    avoidHighways: true,
    avoidTolls: false
  },
  { 
    id: 2, 
    name: "Express Route", 
    duration: "55 mins", 
    stops: 3, 
    fare: "₹35",
    description: "A faster route that bypasses Khuni Majra, using the highway for quicker travel time.",
    color: "#008000", // Green
    departureTime: "06:00 AM",
    arrivalTime: "06:55 AM",
    trafficCondition: "Light traffic, toll road",
    avoidHighways: false,
    avoidTolls: false
  },
  { 
    id: 3, 
    name: "Night Service", 
    duration: "1 hr 5 mins", 
    stops: 4, 
    fare: "₹30",
    description: "Special evening service with security personnel, following a safer route with better lighting.",
    color: "#6366F1", // Indigo
    departureTime: "08:00 PM",
    arrivalTime: "09:05 PM",
    trafficCondition: "Light traffic in evening hours",
    avoidHighways: false,
    avoidTolls: true
  }
];

// Improved RouteMap component with better error handling and debugging
const RouteMap = memo(({ route, origin, destination, busStops, onStopSelect }) => {
  const [directions, setDirections] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  // Function to calculate route
  const calculateRoute = useCallback(() => {
    if (!window.google || !map) return;
    
    setIsCalculating(true);
    setError(null);
    
    const directionsService = new window.google.maps.DirectionsService();
    
    // Filter stops based on route type
    const filteredStops = busStops.filter(stop => {
      if (route.id === 2) {
        // Express route skips Khuni Majra
        return !stop.isOrigin && !stop.isDestination && stop.name === "Landran Bus Stand";
      }
      return !stop.isOrigin && !stop.isDestination;
    });
    
    // Create waypoints from filtered stops
    const waypoints = filteredStops.map(stop => ({
      location: new window.google.maps.LatLng(stop.location.lat, stop.location.lng),
      stopover: true
    }));
    
    console.log(`Calculating route ${route.id} with ${waypoints.length} waypoints`);
    console.log("Origin:", origin);
    console.log("Destination:", destination);
    console.log("Waypoints:", waypoints);
    
    const routeOptions = {
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: route.id === 2, // Optimize for express route
      avoidHighways: route.avoidHighways,
      avoidTolls: route.avoidTolls
    };
    
    directionsService.route(routeOptions, (result, status) => {
      setIsCalculating(false);
      
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log(`Route ${route.id} calculated successfully:`, result);
        setDirections(result);
      } else {
        console.error(`Error fetching directions for route ${route.id}: ${status}`);
        setError(`Failed to calculate route: ${status}`);
        
        // Provide more specific error messages
        if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
          setError("No route could be found between the origin and destination");
        } else if (status === window.google.maps.DirectionsStatus.NOT_FOUND) {
          setError("One or more locations could not be found");
        } else if (status === window.google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED) {
          setError("Too many waypoints were provided");
        } else if (status === window.google.maps.DirectionsStatus.INVALID_REQUEST) {
          setError("The request was invalid");
        }
      }
    });
  }, [route, origin, destination, busStops, map]);

  // Calculate route when map is ready
  useEffect(() => {
    if (map) {
      calculateRoute();
    }
  }, [map, calculateRoute]);

  // Handle map load
  const handleMapLoad = useCallback((mapInstance) => {
    console.log(`Map for route ${route.id} loaded`);
    setMap(mapInstance);
  }, [route.id]);

  return (
    <div className="mb-10 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Route Information Above Map */}
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-xl font-bold mb-2" style={{color: route.color}}>
          {route.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <span className="font-medium">Duration:</span> {route.duration}
          </div>
          <div>
            <span className="font-medium">Stops:</span> {route.stops}
          </div>
          <div>
            <span className="font-medium">Fare:</span> {route.fare}
          </div>
        </div>
        <div className="mb-2">
          <span className="font-medium">Schedule:</span> {route.departureTime} - {route.arrivalTime}
        </div>
        <div className="mb-2">
          <span className="font-medium">Traffic:</span> {route.trafficCondition}
        </div>
        <p className="text-gray-700">{route.description}</p>
      </div>
      
      {/* Loading indicator */}
      {isCalculating && (
        <div className="flex justify-center items-center h-[400px] bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-500">Calculating route...</p>
        </div>
      )}
      
      {/* Error message */}
      {error && !isCalculating && (
        <div className="flex flex-col justify-center items-center h-[400px] bg-gray-100 p-4">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={calculateRoute}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Map for this route */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={origin}
        zoom={12}
        onLoad={handleMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: route.color,
                strokeWeight: 5,
                strokeOpacity: 0.8
              },
              suppressMarkers: true,
            }}
          />
        )}
        
        {/* Bus stop markers */}
        {map && busStops
          .filter(stop => {
            // Filter stops based on route type
            if (route.id === 2) return stop.name !== "Khuni Majra" || stop.isOrigin || stop.isDestination;
            return true; // Show all stops for other routes
          })
          .map((stop, index) => (
            <Marker
              key={`${route.id}-${index}`}
              position={stop.location}
              icon={{
                url: stop.isOrigin || stop.isDestination 
                  ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" 
                  : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              onClick={() => onStopSelect(stop)}
            />
          ))}
      </GoogleMap>
    </div>
  );
});

const Bus17 = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [visibleRoutes, setVisibleRoutes] = useState([1]); // Default to showing first route
  
  const origin = busStops.find(stop => stop.isOrigin)?.location;
  const destination = busStops.find(stop => stop.isDestination)?.location;

  // Toggle which routes are visible
  const toggleRouteVisibility = useCallback((routeId) => {
    setVisibleRoutes(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId) 
        : [...prev, routeId]
    );
  }, []);

  // Handle API load error
  const handleLoadError = useCallback((error) => {
    console.error("Error loading Google Maps API:", error);
    setLoadError("Failed to load Google Maps. Please check your internet connection and API key.");
  }, []);

  // Handle API load success
  const handleApiLoaded = useCallback(() => {
    console.log("Google Maps API loaded successfully");
    setIsLoaded(true);
  }, []);

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
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Driver Information</h3>
            <p><span className="font-medium">Name:</span> {busData.driverName}</p>
            <p><span className="font-medium">Contact:</span> {busData.driverContact}</p>
          </div>
        </div>
      </div>

      {/* Route Selection Section */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Route Options</h2>
        <p className="mb-4 text-gray-600">Select routes to view their maps:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {routeOptions.map(route => (
            <button
              key={route.id}
              className={`px-4 py-2 rounded-full ${
                visibleRoutes.includes(route.id) 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => toggleRouteVisibility(route.id)}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      {/* Multiple Maps Section */}
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={handleApiLoaded}
        onError={handleLoadError}
        loadingElement={
          <div className="flex justify-center items-center h-[400px] bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-blue-500">Loading Google Maps...</p>
          </div>
        }
      >
        {loadError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-bold mb-2">Error Loading Maps</h3>
            <p>{loadError}</p>
          </div>
        )}
        
        {isLoaded && origin && destination && (
          <>
            {/* Render a separate map for each visible route */}
            {routeOptions
              .filter(route => visibleRoutes.includes(route.id))
              .map(route => (
                <RouteMap
                  key={`route-map-${route.id}`}
                  route={route}
                  origin={origin}
                  destination={destination}
                  busStops={busStops}
                  onStopSelect={setSelectedStop}
                />
              ))}
            
            {/* InfoWindow for selected stop - rendered outside maps to avoid duplication */}
            {selectedStop && (
              <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{selectedStop.name}</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedStop(null)}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm">Arrival: {selectedStop.arrivalTime}</p>
                <p className="text-sm">Departure: {selectedStop.departureTime}</p>
              </div>
            )}
          </>
        )}
      </LoadScript>

      {/* Bus Stops Schedule Table */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bus Stops & Schedule</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Stop Name</th>
                <th className="py-2 px-4 text-left">Arrival</th>
                <th className="py-2 px-4 text-left">Departure</th>
                <th className="py-2 px-4 text-left">Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {busStops.map((stop, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4">{stop.name}</td>
                  <td className="py-2 px-4">{stop.arrivalTime}</td>
                  <td className="py-2 px-4">{stop.departureTime}</td>
                  <td className="py-2 px-4">
                    {stop.name === "Khuni Majra" 
                      ? "Via Road 205A, Night Service" 
                      : "All Routes"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Bus17;
