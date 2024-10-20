import React, { useContext,useEffect } from 'react'
import { ListingsContext } from '../../src/hooks/ListingsContext';
import { getOneUserListingAPI } from "../../src/Api/ListingApi"; 
import { useParams } from 'react-router-dom';
export default function ListingDetails() {
  const baseUrl = "http://localhost:3600/";

    const { id } = useParams();
    const { state, dispatch } = useContext(ListingsContext); 
  const { currentListing  } = state;
  useEffect(() => {
    // Fetch rental details by ID
    const fetchRentalDetails = async () => {
      try {
        console.log("fetched detail id:::", id);
        const response = await getOneUserListingAPI(id);
        console.log("suuuuccess", response.data)
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
      } catch (error) {
        console.error('Error fetching rental details', error);
      }
    };

    fetchRentalDetails();
  }, [id]);

  if (!currentListing) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <h1>Details page is working for now</h1>
  
    <h1>{currentListing.title}</h1>
    <p>{currentListing.price}</p>
  
    {/* Check if currentListing.images exists and map through images */}
    {currentListing.images && currentListing.images.map((image) => (
      <div key={image._id}>
        {/* Display the image using the 'url' property */}
        <img src={`${baseUrl}${image.url}`} alt={image.caption || 'Image'} style={{ width: '200px', height: 'auto' }} />
        {/* Optionally display the caption if it exists */}
        {image.caption && <p>{image.caption}</p>}
      </div>
    ))}
  </div>
  
  )
}
