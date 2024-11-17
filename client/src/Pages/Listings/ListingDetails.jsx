import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../hooks/ListingsContext';
import { getOneUserListingAPI } from "../../Api/ListingApi";
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Image, 
  IconButton, 
  Spinner, 
  Flex, 
  Divider, 
  VStack,
  Text,
  Avatar,
  Button,
  Textarea,
  HStack,
  useToast
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/AuthContext';

import DisplayListingComments from './Comments/DisplayListingComments';
import AddCommentsInListing from './Comments/AddCommentsInListing';

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  // const [replyingTo, setReplyingTo] = useState(null);
  // const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await getOneUserListingAPI(id);
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
        
      } catch (error) {
        console.error('Error fetching rental details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [id, dispatch]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.images.length
        : (prevIndex - 1 + currentListing.images.length) % currentListing.images.length
    ));
  };

  const handleVideoNavigation = (direction) => {
    setCurrentVideoIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.videos.length
        : (prevIndex - 1 + currentListing.videos.length) % currentListing.videos.length
    ));
  };
  

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Text fontSize="2xl" fontWeight="bold">{currentListing.title}</Text>
        <Text fontSize="xl">Price: ${currentListing.price}</Text>
      </Box>

      {currentListing.images && (
        <Box position="relative" width="600px" height="400px" mx="auto">
          <Image
            src={`${baseUrl}${currentListing.images[currentImageIndex].url}`}
            alt={currentListing.images[currentImageIndex].caption || 'Image'}
            boxSize="full"
            objectFit="cover"
          />
          <IconButton
            icon={<ChevronLeftIcon />}
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            onClick={() => handleImageNavigation('prev')}
            zIndex="1"
            colorScheme="teal"
            aria-label="Previous Image"
          />
          <IconButton
            icon={<ChevronRightIcon />}
            position="absolute"
            top="50%"
            right="0"
            transform="translateY(-50%)"
            onClick={() => handleImageNavigation('next')}
            zIndex="1"
            colorScheme="teal"
            aria-label="Next Image"
          />
        </Box>
      )}

      <Divider />

      <Box>
       
        <VStack spacing={4} align="stretch">
          <Box>
            <AddCommentsInListing toast={toast} id={id}/> 

            <DisplayListingComments currentID={currentListing._id}/>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ListingDetails;
