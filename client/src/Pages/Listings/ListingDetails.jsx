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
  Heading,
  ListItem,
  ListIcon,
  List,
} from '@chakra-ui/react';
import { StarIcon, MapPinIcon, MessageCircleIcon, CarIcon, FuelIcon as GasPumpIcon, UsersIcon } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon, ChatIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';


import DisplayListingComments from './Comments/ReviewsInListing';
import AddCommentsInListing from './Comments/CommentsInListing';
import ReviewsInListing from './Comments/ReviewsInListing';

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  // const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // if(!user)
    // {
    //   console.log("no user here in listing yet")
    //   return
    // }
    const fetchRentalDetails = async () => {
      try {
        const response = await getOneUserListingAPI(id);
        console.log('Fetched listing data:', response.data);
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
      } catch (error) {
        console.error('Error fetching rental details', error);
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    fetchRentalDetails();
  }, [id]);
  // }, [id, user]);

  useEffect(()=>{
    console.log("current Listing", currentListing);

  },[currentListing])

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.images.length
        : (prevIndex - 1 + currentListing.images.length) % currentListing.images.length
    ));
  };

  // if (loading) {
  //   return (
  //     <Flex justify="center" align="center" height="100vh">
  //       <Spinner size="xl" />
  //     </Flex>
  //   );
  // }

  const handleChatButtonClick = () => {
    // navigate(`/chat/${currentListing.owner._id}/${currentListing._id}/${user._id}`);
    navigate(`/chat`, { state: { ownerIdDetails: currentListing.owner, listingIdDetails : currentListing._id, userIdDetails: user } });
  };
  return (
    <Box borderRadius={'10px'} bg="orange.50" _dark={{ bg: 'gray.900' }} minH="100vh" py={8} >
      <Box maxW="container.xl" mx="auto" px={4}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <VStack spacing={6} align="start">
              <Heading as="h1" size="xl" color="gray.900" _dark={{ color: 'white' }}>{currentListing?.title}</Heading>  
              <Flex align="center" gap={4}>
                <Badge colorScheme="orange" px={3} py={1} fontSize="sm">${currentListing?.price}/{currentListing?.priceUnit}</Badge> 
                <Flex align="center">
                   {/* <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={`w-5 h-5 ${i < Math.floor(listingData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}

                                </div> */}
    
                  <Text ml={1} color="gray.700" _dark={{ color: 'gray.300' }}> ({currentListing?.averageRating} reviews)</Text>
                   {/* <Text ml={1} color="gray.700" _dark={{ color: 'gray.300' }}>Reviews/Rating -- add it later</Text>  */}
                  
                </Flex>
              </Flex>
              {/* <Image src={currentListing.images[0] || "/placeholder.svg"} alt={currentListing.title} borderRadius="lg" w="full" h="96" objectFit="cover" /> */}
              
              <Box 
  position="relative" 
  w="100%" 
  maxW="600px" 
  mx="auto" 
  aspectRatio={16 / 9}  // Maintain aspect ratio
>
  <Image
    src={
      currentListing?.images && currentListing?.images?.length > 0 
        ? `${baseUrl}${currentListing.images[currentImageIndex].url}` 
        :'/images/make_listing/random.png'  // Default image path
    }
    // alt={
    //   currentListing?.images && currentListing?.images?.length > 0 
    //     ? currentListing.images[currentImageIndex].caption || 'Image' 
    //     : 'Default image'
    // }
    objectFit="cover"
    borderRadius="lg"
    w="100%"
    h="100%"
  />

  {currentListing?.images && currentListing?.images?.length > 1 && (
    <>
      <IconButton
        icon={<ChevronLeftIcon />}
        position="absolute"
        top="50%"
        left="10px"
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
        right="10px"
        transform="translateY(-50%)"
        onClick={() => handleImageNavigation('next')}
        zIndex="1"
        colorScheme="teal"
        aria-label="Next Image"
      />
    </>
  )}
</Box>






              <Box  bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="lg" shadow="md" w="full" >
              <Heading mb={4} fontSize={'28px'}>Description</Heading>
              <Text fontSize="lg" color="gray.700" _dark={{ color: 'gray.300' }}>{currentListing?.description || 'NO description added'}</Text>
              </Box>
              

              <Box  bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="lg" shadow="md" w="full" >
              <Heading mb={4} fontSize={'28px'}>Rules</Heading>
              <List spacing={3}>

        { currentListing?.rules?.length > 0 ? (
          currentListing?.rules?.map((rule, index) => (
            <ListItem key={index} fontSize="md" color="gray.600">
              <ListIcon as={CheckCircleIcon} color="green.500" />
              {rule}
            </ListItem>
          ))
        ) :(<Text>No rules Defined</Text>) }
      </List>
              </Box>
              {/* <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                {carData.features.map((feature, index) => (
                  <Flex key={index} align="center" gap={2}>
                    <CarIcon size={20} color="blue.500" />
                    <Text color="gray.700" _dark={{ color: 'gray.300' }}>{feature}</Text>
                  </Flex>
                ))}
              </Grid> */}

              {/* <Heading as="h2" size="lg" color="gray.900" _dark={{ color: 'white' }}>Specifications</Heading> */}
              {/* <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Flex align="center" gap={2}>
                  <GasPumpIcon size={20} color="blue.500" />
                  <Text color="gray.700" _dark={{ color: 'gray.300' }}>Range: {carData.specs.range}</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <CarIcon size={20} color="blue.500" />
                  <Text color="gray.700" _dark={{ color: 'gray.300' }}>Acceleration: {carData.specs.acceleration}</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <CarIcon size={20} color="blue.500" />
                  <Text color="gray.700" _dark={{ color: 'gray.300' }}>Top Speed: {carData.specs.topSpeed}</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <UsersIcon size={20} color="blue.500" />
                  <Text color="gray.700" _dark={{ color: 'gray.300' }}>Seating: {carData.specs.seating}</Text>
                </Flex>
              </Grid> */}
            </VStack>
          </GridItem>

          <VStack spacing={6}>
            <Box bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="lg" shadow="md" w="full">
              <Heading as="h3" size="md" color="gray.900" _dark={{ color: 'white' }} mb={4}>Location</Heading>
              <Image src="/images/make_listing/map.png" alt="Location Map" borderRadius="md" w="full" h={48} objectFit="cover" mb={4} />
              <Flex align="center" gap={2}>
                <MapPinIcon size={20} color="blue.500" />
                <Text color="gray.700" _dark={{ color: 'gray.300' }}>Location XYZ</Text>
                {/* <Text color="gray.700" _dark={{ color: 'gray.300' }}>{carData.location}</Text> */}
              </Flex>
            </Box>

            {
              user?._id !== currentListing?.owner?._id && (
                <Box bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="lg" shadow="md" w="full">
              <Heading as="h3" size="md" color="gray.900" _dark={{ color: 'white' }} mb={4}>Owner</Heading>
              {/* <Text color="gray.700" _dark={{ color: 'gray.300' }} mb={4}>{carData.owner}</Text> */}
              <Avatar src={ `${import.meta.env.VITE_BACK_END_URL}${currentListing?.owner?.imageUrl}` ||
                                currentListing?.owner?.imageUrl
                           }/>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} mb={4}>{currentListing?.owner?.name}</Text>

              <HStack alignItems={'center'}>
              <Button  onClick={handleChatButtonClick}  leftIcon={<MessageCircleIcon size={20} /> } variant={"customButton"} w="full">
              Chat with Owner
              </Button>

              <Link to={`/profile/${currentListing?.owner?._id}`}>
                 <Button bg={'white'} color={'orange.500'} border={'1px solid orange'}
                 _hover={{bg:'orange.400', color:'white'}}
                  w="full" >
                     View Owner Profile
                  </Button>
               </Link>
              </HStack>
             
            </Box>
              )

            }
            
            { currentListing?.category !== 'car' &&
              (
                <Box  bg="white" _dark={{ bg: 'gray.800' }} p={6} borderRadius="lg" shadow="md" w="full" >
              <Heading mb={4} fontSize={'28px'}>Amenities</Heading>
              <List spacing={3}>
        { currentListing?.amenities?.length > 0 ? (
           currentListing?.amenities?.map((amenities, index) => (
            <ListItem key={index} fontSize="md" color="gray.600">
              <ListIcon as={CheckCircleIcon} color="green.500" />
              {amenities}
            </ListItem>
          ))
        ) : (<Text>No Amenities added yet</Text>) }
      </List>
              </Box>

              )
            }
            
            
          </VStack>

           <Box>
                  <VStack spacing={4} align="stretch">
                    <Flex flexDir={'column'} gap={4}>
                    <ReviewsInListing/>
                      <AddCommentsInListing toast={toast} id={id} currentID={currentListing?._id}/> 
                      {/* <DisplayListingComments currentID={currentListing?._id}/> */}
                      
                    </Flex>
                  </VStack>
                </Box>
        </Grid>
      </Box>
    </Box>
  );

  // return (
  //   <VStack spacing={8} align="stretch" p={6}>
  //     <Box>
  //       <Text fontSize="3xl" fontWeight="bold">{currentListing.title}</Text>
  //       <Badge colorScheme={currentListing.status === 'pending' ? 'yellow' : 'green'}>
  //         {currentListing.status}
  //       </Badge>
  //     </Box>

  //     <Grid templateColumns="repeat(2, 1fr)" gap={6}>
  //       <GridItem>
  //         <Box borderWidth="1px" borderRadius="lg" p={4}>
  //           <Text fontSize="lg" fontWeight="semibold">Basic Information</Text>
  //           <VStack align="stretch" spacing={3} mt={2}>
  //             <Text>ID: {currentListing._id}</Text>
  //             <Text>Category: {currentListing.category}</Text>
  //             <Text>Owner: {currentListing.owner?.name} ({currentListing.owner?.email})</Text>
  //             <Text>Price: ${currentListing.price}/{currentListing.priceUnit}</Text>
  //             <Text>Description: {currentListing.description}</Text>
  //             <Text>Average Rating: {currentListing.averageRating || 'No ratings yet'}</Text>
  //           </VStack>
  //         </Box>
  //       </GridItem>

  //       <GridItem>
  //         <Box borderWidth="1px" borderRadius="lg" p={4}>
  //           <Text fontSize="lg" fontWeight="semibold">Additional Details</Text>
  //           <VStack align="stretch" spacing={3} mt={2}>
  //             <Box>
  //               <Text fontWeight="medium">Amenities:</Text>
  //               {currentListing.amenities.map((amenity, index) => (
  //                 <Badge key={index} m={1}>{amenity}</Badge>
  //               ))}
  //             </Box>
  //             <Box>
  //               <Text fontWeight="medium">Rules:</Text>
  //               {currentListing.rules.map((rule, index) => (
  //                 <Text key={index}>• {rule}</Text>
  //               ))}
  //             </Box>
  //           </VStack>
  //         </Box>
  //       </GridItem>
  //     </Grid>

  //     {currentListing.images && currentListing.images.length > 0 && (
  //       <Box position="relative" width="600px" height="400px" mx="auto">
  //         <Image
  //           src={`${baseUrl}${currentListing.images[currentImageIndex].url}`}
  //           alt={currentListing.images[currentImageIndex].caption || 'Image'}
  //           boxSize="full"
  //           objectFit="cover"
  //           borderRadius="lg"
  //         />
  //         <IconButton
  //           icon={<ChevronLeftIcon />}
  //           position="absolute"
  //           top="50%"
  //           left="0"
  //           transform="translateY(-50%)"
  //           onClick={() => handleImageNavigation('prev')}
  //           zIndex="1"
  //           colorScheme="teal"
  //           aria-label="Previous Image"
  //         />
  //         <IconButton
  //           icon={<ChevronRightIcon />}
  //           position="absolute"
  //           top="50%"
  //           right="0"
  //           transform="translateY(-50%)"
  //           onClick={() => handleImageNavigation('next')}
  //           zIndex="1"
  //           colorScheme="teal"
  //           aria-label="Next Image"
  //         />
  //       </Box>
  //     )}

  //     <Divider />

  //    {user && currentListing.owner && (
  //       <Box>
  //         <Button
  //           colorScheme="teal"
  //           leftIcon={<ChatIcon />}
  //           onClick={handleChatButtonClick} 
  //           mb={4}
  //         >
  //           Chat with Owner
  //         </Button>

  //         {/* <MainChatComponent 
  //           user={user} 
  //           currentListing={currentListing} 
  //           setActiveIndex={() => {}}
  //         /> */}
  //       </Box>
  //     )}

  //     <Box>
  //       <VStack spacing={4} align="stretch">
  //         <Box>
  //           <AddCommentsInListing toast={toast} id={id}/> 
  //           <DisplayListingComments currentID={currentListing._id}/>
  //         </Box>
  //       </VStack>
  //     </Box>
  //   </VStack>
  // );
};

export default ListingDetails;