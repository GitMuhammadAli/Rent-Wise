import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../src/hooks/ListingsContext';
import { getOneUserListingAPI } from "../../src/Api/ListingApi";
import { useParams } from 'react-router-dom';
import { Box, Image, IconButton, Spinner, Flex, Divider } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const baseUrl = "http://localhost:3600";

export default function ListingDetails() {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        console.log("fetched detail id:::", id);
        const response = await getOneUserListingAPI(id);
        console.log("success", response.data);
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
      } catch (error) {
        console.error('Error fetching rental details', error);
      } finally {
        setLoading(false); // Stop loading whether the fetch succeeds or fails
      }
    };

    fetchRentalDetails();
  }, [id, dispatch]);

  const handleImageLoad = () => {
    // This could be useful if you want to set loading for images separately
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? currentListing.images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === currentListing.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex === 0 ? currentListing.videos.length - 1 : prevIndex - 1));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex === currentListing.videos.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return <Flex alignSelf={'center'}> <Spinner size={'xl'}/> </Flex>;
  }

  return (
    <div>
      <h1>Details page is working for now</h1>
      <h1>{currentListing.title}</h1>
      <p>{currentListing.price}</p>
      <p>{currentListing.minimumBid}</p>
      <p>{currentListing.bidding.bidIncrement}</p>
      <p>{currentListing.bidEndDate}</p>
    

      {currentListing.images && currentListing.images.length > 0 && (
        <Box position="relative" width="600px" height="400px" mx="auto" mt="4">
          <Image
            src={`${baseUrl}${currentListing.images[currentImageIndex].url}`}
            alt={currentListing.images[currentImageIndex].caption || 'Image'}
            boxSize="full"
            objectFit="cover"
            onLoad={handleImageLoad}
          />

{
  currentListing.images.length > 1 && 
  <>
 {/* Left arrow */}
 <IconButton
            icon={<ChevronLeftIcon />}
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            onClick={handlePrev}
            zIndex="1"
            colorScheme="teal"
            aria-label="Previous Image"
          />

          {/* Right arrow */}
          <IconButton
            icon={<ChevronRightIcon />}
            position="absolute"
            top="50%"
            right="0"
            transform="translateY(-50%)"
            onClick={handleNext}
            zIndex="1"
            colorScheme="teal"
            aria-label="Next Image"
          />
  </>
}
         
        </Box>
      )}

      

{currentListing.videos && currentListing.videos.length > 0 && (
  <Box position="relative" width="600px" height="400px" mx="auto" mt="4">
    <video
      controls
      width="100%"
      height="100%"
      src={`${baseUrl}${currentListing.videos[currentVideoIndex].url}`} // Ensure this points to the correct URL
      onError={(e) => {
        console.error('Error loading video:', e);
        e.target.src = 'fallback-video-url'; // Optional: Set a fallback video URL
      }}
    >
      Your browser does not support the video tag.
    </video>


    {
  currentListing.videos.length > 1 &&
  <>

<IconButton
      icon={<ChevronLeftIcon />}
      position="absolute"
      top="50%"
      left="0"
      transform="translateY(-50%)"
      onClick={handlePrevVideo}
      zIndex="1"
      colorScheme="teal"
      aria-label="Previous Video"
    />

    {/* Right arrow */}
    <IconButton
      icon={<ChevronRightIcon />}
      position="absolute"
      top="50%"
      right="0"
      transform="translateY(-50%)"
      onClick={handleNextVideo}
      zIndex="1"
      colorScheme="teal"
      aria-label="Next Video"
    />
  </>
}
    {/* Left arrow */}
    

  </Box>
)}

    </div>
  );
}




