import React, { useState, useEffect } from 'react';
import { getAllListing } from "../../src/Api/ListingApi"; 

export default function GetAllListings() {
  const [listing, setListing] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllListing();
        console.log("Response is: ", response);
        setListing(response.data); 
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
  {listing.length > 0 ? (
    <ul>
      {listing.map((item) => (
        <li key={item._id}>
          <p>coordinates: {item.location.coordinates.latitude}</p>
          <p>Title: {item.title}</p>
          <p>address: {item.location.address}</p>
          <p>city: {item.city}</p>
          <p>state: {item.state}</p>
          <p>country: {item.country}</p>
       
        </li>
      ))}
    </ul>
  ) : (
    <p>No listings found.</p>
  )}
</div>

  );
}
