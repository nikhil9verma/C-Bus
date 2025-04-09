import { useEffect } from 'react';

const useAdvancedMarker = (map, position) => {
  useEffect(() => {
    if (map && position) {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: 'Custom Marker',
      });

      return () => {
        marker.setMap(null);
      };
    }
  }, [map, position]);
};

export default useAdvancedMarker;
