import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const locations = [
  { id: 1, name: 'Kharar', position: { lat: 30.750300501113628, lng: 76.64071199597718 } },
  { id: 2, name: 'ISBT 43', position: { lat: 30.71711854736046, lng: 76.74299345914386 } },
  
  { id: 3, name: 'Sector 17 bus stand', position: { lat: 30.740123, lng: 76.782345 } },
  { id: 4, name: 'PGI Hospital', position: { lat: 30.765432, lng: 76.801234 } },
  
  {id : 5, name: 'VR mall',position:{lat:30.7273,lng:76.7093}},
  {id : 6, name: 'Landran', position:{lat: 30.6944978, lng: 76.6650876}}
];

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 30.74130849473727,
  lng: 76.6739234512148
};

const MyMapComponent = ({ onStartSelect, onEndSelect, showMarkers }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [selectionMode, setSelectionMode] = useState('start'); // 'start' or 'end'

  // Function to toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(prevMode => prevMode === 'start' ? 'end' : 'start');
  };

  useEffect(() => {
    if (map && window.google) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      // Create new markers if showMarkers is true
      if (showMarkers) {
        const newMarkers = locations.map(location => {
          // Create custom marker icon based on whether it's selected as start or end
          let icon = null;
          
          if (selectedStart && 
              selectedStart.lat === location.position.lat && 
              selectedStart.lng === location.position.lng) {
            icon = {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4', // Google blue
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
            };
          } else if (selectedEnd && 
                    selectedEnd.lat === location.position.lat && 
                    selectedEnd.lng === location.position.lng) {
            icon = {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#EA4335', // Google red
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
            };
          }

          const marker = new window.google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            icon: icon
          });

          marker.addListener('click', () => {
            console.log(`Marker clicked: ${location.name}`, location.position);
            
            if (selectionMode === 'start') {
              setSelectedStart(location.position);
              onStartSelect(location.position, location.name);
            } else {
              setSelectedEnd(location.position);
              onEndSelect(location.position, location.name);
            }
          });
          
          return marker;
        });

        setMarkers(newMarkers);
      }

      // Cleanup function
      return () => {
        markers.forEach(marker => marker.setMap(null));
      };
    }
  }, [map, showMarkers, selectionMode, selectedStart, selectedEnd]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Start Location: {selectedStart ? locations.find(l => 
            l.position.lat === selectedStart.lat && 
            l.position.lng === selectedStart.lng)?.name || 'None' : 'None'}</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
          <span>End Location: {selectedEnd ? locations.find(l => 
            l.position.lat === selectedEnd.lat && 
            l.position.lng === selectedEnd.lng)?.name || 'None' : 'None'}</span>
        </div>
      </div>
      
      <button 
        className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={toggleSelectionMode}
      >
        Currently selecting: {selectionMode === 'start' ? 'Start Location' : 'End Location'}
      </button>
      
      <LoadScript 
        googleMapsApiKey="AIzaSyAqIyBs3D2G4pvzA-YGSH500mx5AJQI698"
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={setMap}
        >
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MyMapComponent;