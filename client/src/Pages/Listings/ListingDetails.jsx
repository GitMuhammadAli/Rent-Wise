import React, { useContext, useEffect, useState ,  } from 'react';
import { ListingsContext } from '../../hooks/ListingsContext';
import { getOneUserListingAPI } from "../../Api/ListingApi";
import { useParams, useNavigate } from 'react-router-dom';
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
  useToast,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ChatIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/AuthContext';

import DisplayListingComments from './Comments/DisplayListingComments';
import AddCommentsInListing from './Comments/AddCommentsInListing';
import MainChatComponent from '../Chats/MainChat';

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { user, token } = useAuth();
  const toast = useToast();
 

  useEffect(() => {
    
    const fetchRentalDetails = async () => {
      if(!token)
        {
          console.log("token required")
          return;
        }
      try {
        const response = await getOneUserListingAPI(id, token);
        console.log('Fetched listing data:', response.data);
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
      } catch (error) {
        console.error('Error fetching rental details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [id, dispatch, token]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.images.length
        : (prevIndex - 1 + currentListing.images.length) % currentListing.images.length
    ));
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const handleChatButtonClick = () => {
    // navigate(`/chat/${currentListing.owner._id}/${currentListing._id}/${user._id}`);
    navigate(`/chat`, { state: { ownerIdDetails: currentListing.owner, listingIdDetails : currentListing, userIdDetails: user } });

  };
  return (
    <VStack spacing={8} align="stretch" p={6}>
      <Box>
        <Text fontSize="3xl" fontWeight="bold">{currentListing.title}</Text>
        <Badge colorScheme={currentListing.status === 'pending' ? 'yellow' : 'green'}>
          {currentListing.status}
        </Badge>
      </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text fontSize="lg" fontWeight="semibold">Basic Information</Text>
            <VStack align="stretch" spacing={3} mt={2}>
              <Text>ID: {currentListing._id}</Text>
              <Text>Category: {currentListing.category}</Text>
              <Text>Owner: {currentListing.owner?.name} ({currentListing.owner?.email})</Text>
              <Text>Price: ${currentListing.price}/{currentListing.priceUnit}</Text>
              <Text>Description: {currentListing.description}</Text>
              <Text>Average Rating: {currentListing.averageRating || 'No ratings yet'}</Text>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text fontSize="lg" fontWeight="semibold">Additional Details</Text>
            <VStack align="stretch" spacing={3} mt={2}>
              <Box>
                <Text fontWeight="medium">Amenities:</Text>
                {currentListing.amenities.map((amenity, index) => (
                  <Badge key={index} m={1}>{amenity}</Badge>
                ))}
              </Box>
              <Box>
                <Text fontWeight="medium">Rules:</Text>
                {currentListing.rules.map((rule, index) => (
                  <Text key={index}>• {rule}</Text>
                ))}
              </Box>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {currentListing.images && currentListing.images.length > 0 && (
        <Box position="relative" width="600px" height="400px" mx="auto">
          <Image
            src={`${baseUrl}${currentListing.images[currentImageIndex].url}`}
            alt={currentListing.images[currentImageIndex].caption || 'Image'}
            boxSize="full"
            objectFit="cover"
            borderRadius="lg"
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

     {user && currentListing.owner && (
        <Box>
          <Button
            colorScheme="teal"
            leftIcon={<ChatIcon />}
            onClick={handleChatButtonClick} 
            mb={4}
          >
            Chat with Owner
          </Button>

          {/* <MainChatComponent 
            user={user} 
            currentListing={currentListing} 
            setActiveIndex={() => {}}
          /> */}
        </Box>
      )}

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