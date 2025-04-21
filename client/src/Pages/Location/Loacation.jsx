
// // LocationPicker.jsx
// import React, { useState } from 'react';
// import { GoogleMap, useLoadScript } from '@react-google-maps/api';

// const mapContainerStyle = {
//   width: '100%',
//   height: '400px',
// };

// const defaultCenter = {
//   lat: 28.6139,
//   lng: 77.2090,
// };

// const LocationPicker = () => {
//   const [location, setLocation] = useState(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyA...yourFriendMightHaveUsedThis', // This can be a demo/public key
//   });

//   const handleClick = (event) => {
//     setLocation({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   };

//   if (loadError) return <p>Error loading map</p>;
//   if (!isLoaded) return <p>Loading...</p>;

//   return (
//     <div>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={10}
//         center={defaultCenter}
//         onClick={handleClick}
//       />
//       {location && (
//         <div>
//           <p><strong>Latitude:</strong> {location.lat}</p>
//           <p><strong>Longitude:</strong> {location.lng}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationPicker;


// LocationPicker.jsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SearchMarker = ({ position }) => {
  const map = useMap();

  if (position) {
    map.setView(position, 13);
    return <Marker position={position} />;
  }

  return null;
};

const LocationSearch = () => {
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}`);
    const data = await res.json();

    if (data && data.length > 0) {
      const loc = data[0];
      const newPos = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
      setPosition(newPos);

      const { address } = loc;

      const extracted = {
        address: loc.display_name || query,
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        country: address.country || '',
        zipCode: address.postcode || '',
        coordinates: {
          latitude: parseFloat(loc.lat),
          longitude: parseFloat(loc.lon),
        },
      };

      setLocationDetails(extracted);
      console.log('Location Data for DB:', extracted);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px' }}>Search</button>

      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '400px', width: '100%', marginTop: '20px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchMarker position={position} />
      </MapContainer>

      {locationDetails && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Selected Location Details</h3>
          <p><strong>Address:</strong> {locationDetails.address}</p>
          <p><strong>City:</strong> {locationDetails.city}</p>
          <p><strong>State:</strong> {locationDetails.state}</p>
          <p><strong>Country:</strong> {locationDetails.country}</p>
          <p><strong>Zip Code:</strong> {locationDetails.zipCode}</p>
          <p><strong>Latitude:</strong> {locationDetails.coordinates.latitude}</p>
          <p><strong>Longitude:</strong> {locationDetails.coordinates.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
