import React, { useState } from "react";
import MyMapComponent from "./MapMyComponent";
import { buses } from "./BusData"; // Use named import for buses

const Home = () => {
  const [availableBuses, setAvailableBuses] = useState([]);
  const [error, setError] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [step, setStep] = useState(1); // Step to track the selection process
  const [startLocationName, setStartLocationName] = useState('');
  const [endLocationName, setEndLocationName] = useState('');

  const handleStartSelect = (location, name) => {
    console.log('Start selected:', location);
    setStart(location);
    setStartLocationName(name);
    setStep(2); // Move to the next step to select the end point
  };

  const handleEndSelect = (location, name) => {
    console.log('End selected:', location);
    setEnd(location);
    setEndLocationName(name);
    setStep(3); // Move to the next step after selecting the end point
  };

  const resetSelection = () => {
    setStart(null);
    setEnd(null);
    setStartLocationName('');
    setEndLocationName('');
    setStep(1);
    setAvailableBuses([]);
    setError('');
  };

  const findBuses = () => {
    if (!start || !end) {
      setError('Please select both starting and ending points.');
      return;
    }

    // Find buses that can connect the start and end points
    const connectedBuses = buses.filter(bus => {
      // Check if this bus route includes points near both start and end
      const hasNearbyStart = bus.route.some(location => 
        calculateDistance(start.lat, start.lng, location.lat, location.lng) < 1
      );
      
      const hasNearbyEnd = bus.route.some(location => 
        calculateDistance(end.lat, end.lng, location.lat, location.lng) < 1
      );
      
      // Return true only if this bus serves both areas
      return hasNearbyStart && hasNearbyEnd;
    });

    if (connectedBuses.length === 0) {
      setError('No buses found that connect your selected locations.');
      setAvailableBuses([]);
    } else {
      setError('');
      setAvailableBuses(connectedBuses);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  return (
    <main className="pt-16 ml-40 pl-2 mr-2">
      <div className="body-bg-green-400">
        <div className="pt-20 px-6 text-blue-700">
          <h1 className="text-4xl font-bold text-center my-8">
            Welcome to CBUS!
          </h1>
          <p className="text-lg text-center mb-8">
            Discover the best bus services in town. We are dedicated to
            providing you with safe, reliable, and comfortable travel
            experiences.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-4">Plan Your Journey</h2>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-32 font-medium">Starting Point:</div>
                <div className="flex-1">
                  {startLocationName ? (
                    <span className="font-semibold">{startLocationName}</span>
                  ) : (
                    <span className="text-gray-500">Not selected</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 font-medium">Destination:</div>
                <div className="flex-1">
                  {endLocationName ? (
                    <span className="font-semibold">{endLocationName}</span>
                  ) : (
                    <span className="text-gray-500">Not selected</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-4">
              {step > 1 && (
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={resetSelection}
                >
                  Reset
                </button>
              )}
              
              {step === 3 && (
                <button 
                  onClick={findBuses} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Find Buses
                </button>
              )}
            </div>
            
            <div className="bg-blue-100 p-3 rounded mb-4">
              {step === 1 && <p>Please select your starting point on the map</p>}
              {step === 2 && <p>Now select your destination on the map</p>}
              {step === 3 && <p>You can now find buses for your journey</p>}
            </div>
          </div>
          
          <MyMapComponent
            onStartSelect={handleStartSelect}
            onEndSelect={handleEndSelect}
            showMarkers={true}
            selectionStep={step}
            startLocation={start}
            endLocation={end}
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {availableBuses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Available Buses:</h3>
              <ul className="bg-white rounded shadow p-4">
                {availableBuses.map((bus, index) => (
                  <li key={index} className="p-2 border-b last:border-b-0">
                    <div className="font-medium">{bus.name}</div>
                    <div className="text-sm text-gray-600">
                      Route: {bus.route[0].name} to {bus.route[bus.route.length - 1].name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;