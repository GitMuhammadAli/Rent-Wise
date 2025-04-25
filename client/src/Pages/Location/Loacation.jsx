
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

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Flex, Input, Box } from '@chakra-ui/react';

const SearchMarker = ({ position }) => {
  const map = useMap();

  if (position) {
    map.setView(position, 13);
    return <Marker position={position} />;
  }

  return null;
};

const LocationSearch = ({ onLocationSelect  }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${query}`);
      const data = await res.json();

      setSuggestions(data);
    };

    const delayDebounce = setTimeout(fetchSuggestions, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // const handleSearch = async (searchQuery = query) => {
  //   const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${searchQuery}`);
  //   const data = await res.json();

  //   if (data && data.length > 0) {
  //     const loc = data[0];
  //     const newPos = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
  //     setPosition(newPos);

  //     const { address } = loc;

  //     const extracted = {
  //       address: loc.display_name || searchQuery,
  //       city: address.city || address.town || address.village || '',
  //       state: address.state || '',
  //       country: address.country || '',
  //       zipCode: address.postcode || '',
  //       coordinates: {
  //         latitude: parseFloat(loc.lat),
  //         longitude: parseFloat(loc.lon),
  //       },
  //     };

  //     setLocationDetails(extracted);
  //     setSuggestions([]);
  //   }
  // };
  const handleSearch = async (searchQuery = query) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${searchQuery}`);
    const data = await res.json();

    if (data && data.length > 0) {
      const loc = data[0];
      const newPos = { lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) };
      setPosition(newPos);

      const { address } = loc;

      const extracted = {
        address: loc.display_name || searchQuery,
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
      setSuggestions([]);

      if (onLocationSelect) {
        onLocationSelect(extracted); // <- Send to parent
      }
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  useEffect(() => {
   console.log("locationDetails", locationDetails)
  }, [locationDetails]);

  return (
    <Box style={{ position: 'relative'  }}>
      <Flex alignItems={'center'} gap={2} mt={4}>
      <Input
      bg={'white'}
        type="text"
        placeholder="Type address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px', width: '100%' }}
      />
      <Button variant={'customButton'} onClick={() => handleSearch()} style={{ padding: '8px' }}>Search</Button>
      
      </Flex>
      

      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 1000
        }}>
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(item.display_name)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '250px', width: '100%', marginTop: '20px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchMarker position={position} />
      </MapContainer>

      {/* {locationDetails && (
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
      )} */}
    </Box>
  );
};

export default LocationSearch;


