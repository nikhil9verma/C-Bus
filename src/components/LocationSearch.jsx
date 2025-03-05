import React, { useState, useEffect } from 'react';

const LocationSearch = ({ onLocationSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (input) => {
    try {
      const response = await fetch(`https://atlas.mapmyindia.com/api/places/search/json?query=${encodeURIComponent(input)}`, {
        headers: {
          'Authorization': 'Bearer b5329d7b546c60794f560f71b22ecf94'
        }
      });
      const data = await response.json();
      const formattedSuggestions = data.suggestedLocations.map((location) => ({
        placeName: location.placeName,
        placeAddress: location.placeAddress,
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelect = (location) => {
    onLocationSelect(location);
    setQuery(location.placeName);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="font-semibold">{suggestion.placeName}</div>
              <div className="text-sm text-gray-600">{suggestion.placeAddress}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;

