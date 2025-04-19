import React, { forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const SimpleMap = forwardRef((props, ref) => {
  const { center, zoom, markers, onMarkerClick } = props;
  const mapInstance = React.useRef(null);
  const markersRef = React.useRef({});

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    centerOnMarker: (lat, lng) => {
      if (mapInstance.current) {
        mapInstance.current.setView([lat, lng], zoom + 3); // Zoom in closer when centering
      }
    }
  }));

  React.useEffect(() => {
    // Create map
    mapInstance.current = L.map('map', {
      center: center || [20.5937, 78.9629], // Default to center of India
      zoom: zoom || 5,
      zoomControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Add markers
    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        const m = L.marker([marker.lat, marker.lng]).addTo(mapInstance.current);
        
        // Store marker reference
        if (marker.id) {
          markersRef.current[marker.id] = m;
        }
        
        // Add popup
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
        
        // Add click handler
        if (onMarkerClick && marker.id) {
          m.on('click', () => {
            onMarkerClick(marker.id);
          });
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [center, zoom, markers, onMarkerClick]);

  // Update map when markers change
  React.useEffect(() => {
    if (!mapInstance.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = {};
    
    // Add new markers
    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        const m = L.marker([marker.lat, marker.lng]).addTo(mapInstance.current);
        
        // Store marker reference
        if (marker.id) {
          markersRef.current[marker.id] = m;
        }
        
        // Add popup
        if (marker.popup) {
          m.bindPopup(marker.popup);
        }
        
        // Add click handler
        if (onMarkerClick && marker.id) {
          m.on('click', () => {
            onMarkerClick(marker.id);
          });
        }
      });
    }
  }, [markers, onMarkerClick]);

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
});

export default SimpleMap;