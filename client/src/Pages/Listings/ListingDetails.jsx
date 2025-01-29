import React, { useContext, useEffect, useState } from "react";
import { ListingsContext } from "../../hooks/ListingsContext";
import { getOneUserListingAPI } from "../../Api/ListingApi";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import {
  StarIcon,
  MapPinIcon,
  MessageCircleIcon,
  CarIcon,
  FuelIcon as GasPumpIcon,
  UsersIcon,
} from "lucide-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../../hooks/AuthContext";
import { Link } from "react-router-dom";

// import DisplayListingComments from './Comments/DisplayListingComments';
import AddCommentsInListing from "./Comments/CommentsInListing";
import { FaStar } from "react-icons/fa";
import ReviewsInListing from "./Comments/ReviewsInListing";

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
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
        console.log("Fetched listing data:", response.data);
        dispatch({ type: "GET_ONE_LISTING", payload: response.data });
      } catch (error) {
        console.error("Error fetching rental details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [id]);
  // }, [id, user]);

  useEffect(() => {
    console.log("current Listing", currentListing);
  }, [currentListing]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % currentListing.images.length
        : (prevIndex - 1 + currentListing.images.length) %
          currentListing.images.length
    );
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
    navigate(`/chat`, {
      state: {
        ownerIdDetails: currentListing.owner,
        listingIdDetails: currentListing._id,
        userIdDetails: user,
      },
    });
  };
  const StarRating = ({ rating }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <Box
      borderRadius={"10px"}
      bg="orange.50"
      _dark={{ bg: "gray.900" }}
      minH="100vh"
      py={8}
    >
      <Box maxW="container.xl" mx="auto" px={4}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          <GridItem>
            {/* left side details of pages */}
            <VStack spacing={6} align="start">
              <Heading
                as="h1"
                size="xl"
                color="gray.900"
                _dark={{ color: "white" }}
              >
                {currentListing?.title}
              </Heading>
              <Flex align="center" gap={4}>
                <Badge colorScheme="orange" px={3} py={1} fontSize="sm">
                  ${currentListing?.price}/{currentListing?.priceUnit}
                </Badge>
                <Flex align="center">
                  <StarRating rating={currentListing?.averageRating} />
                  <Text ml={1} color="gray.700" _dark={{ color: "gray.300" }}>
                    {" "}
                    ({currentListing?.averageRating} reviews)
                  </Text>

                  {/* <Text ml={1} color="gray.700" _dark={{ color: 'gray.300' }}>Reviews/Rating -- add it later</Text>  */}
                </Flex>
              </Flex>

              {/* images and its arrow */}
              <Box
                position="relative"
                w="100%"
                h={"70%"}
                // maxW="600px"
                mx="auto"
                aspectRatio={16 / 9} // Maintain aspect ratio
              >
                <Image
                  src={
                    currentListing?.images && currentListing?.images?.length > 0
                      ? `${baseUrl}${currentListing.images[currentImageIndex].url}`
                      : "/images/make_listing/random.png" // Default image path
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

                {currentListing?.images &&
                  currentListing?.images?.length > 1 && (
                    <>
                      <IconButton
                        icon={<ChevronLeftIcon />}
                        position="absolute"
                        top="50%"
                        left="10px"
                        transform="translateY(-50%)"
                        onClick={() => handleImageNavigation("prev")}
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
                        onClick={() => handleImageNavigation("next")}
                        zIndex="1"
                        colorScheme="teal"
                        aria-label="Next Image"
                      />
                    </>
                  )}
              </Box>

              {/* Comments and Reviews displayed on top after images in large screen but not displayed in small screens */}
              <Flex
                flexDir={"column"}
                gap={4}
                display={{ base: "none", md: "flex" }}
              >
                <ReviewsInListing />
                <AddCommentsInListing
                  toast={toast}
                  id={id}
                  currentID={currentListing?._id}
                />

                {/* <DisplayListingComments currentID={currentListing?._id}/> */}
              </Flex>
            </VStack>
          </GridItem>

          {/* right side details, including location, owner, description, rules */}
          <VStack spacing={6}>
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
              w="full"
            >
              <Heading
                as="h3"
                size="md"
                color="gray.900"
                _dark={{ color: "white" }}
                mb={4}
              >
                Location
              </Heading>
              <Image
                src="/images/make_listing/map.png"
                alt="Location Map"
                borderRadius="md"
                w="full"
                h={48}
                objectFit="cover"
                mb={4}
              />
              <Flex align="center" gap={2}>
                <MapPinIcon size={20} color="blue.500" />
                <Text color="gray.700" _dark={{ color: "gray.300" }}>
                  Location XYZ
                </Text>
                {/* <Text color="gray.700" _dark={{ color: 'gray.300' }}>{carData.location}</Text> */}
              </Flex>
            </Box>

            {user?._id !== currentListing?.owner?._id && (
              <Box
                bg="white"
                _dark={{ bg: "gray.800" }}
                p={6}
                borderRadius="lg"
                shadow="md"
                w="full"
              >
                <Heading
                  as="h3"
                  size="md"
                  color="gray.900"
                  _dark={{ color: "white" }}
                  mb={4}
                >
                  Owner
                </Heading>
                {/* <Text color="gray.700" _dark={{ color: 'gray.300' }} mb={4}>{carData.owner}</Text> */}
                <Flex alignItems={"center"} gap={3} mb={4}>
                  <Avatar
                    src={
                      `${import.meta.env.VITE_BACK_END_URL}${
                        currentListing?.owner?.imageUrl
                      }` || currentListing?.owner?.imageUrl
                    }
                  />
                  <Text color="gray.700" _dark={{ color: "gray.300" }} mb={4}>
                    {currentListing?.owner?.name}
                  </Text>
                </Flex>

                {/* owner ki profile */}
                <VStack alignItems={"center"}>
                  <Button
                    onClick={handleChatButtonClick}
                    leftIcon={<MessageCircleIcon size={20} />}
                    variant={"customButton"}
                    w="full"
                  >
                    Chat with Owner
                  </Button>

                  <Button
                    as={Link}
                    to={`/profile/${currentListing?.owner?._id}`}
                    bg={"white"}
                    color={"orange.500"}
                    border={"1px solid orange"}
                    _hover={{ bg: "orange.400", color: "white" }}
                    w="full"
                  >
                    View Owner Profile
                  </Button>
                </VStack>
              </Box>
            )}

            {currentListing?.category !== "car" && (
              <Box
                bg="white"
                _dark={{ bg: "gray.800" }}
                p={6}
                borderRadius="lg"
                shadow="md"
                w="full"
              >
                <Heading mb={4} fontSize={"28px"}>
                  Amenities
                </Heading>
                <List spacing={3}>
                  {currentListing?.amenities?.length > 0 ? (
                    currentListing?.amenities?.map((amenities, index) => (
                      <ListItem key={index} fontSize="md" color="gray.600">
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {amenities}
                      </ListItem>
                    ))
                  ) : (
                    <Text>No Amenities added yet</Text>
                  )}
                </List>
              </Box>
            )}
            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
              w="full"
            >
              <Heading mb={4} fontSize={"28px"}>
                Description
              </Heading>
              <Text
                fontSize="sm"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                {currentListing?.description || "NO description added"}
              </Text>
            </Box>

            <Box
              bg="white"
              _dark={{ bg: "gray.800" }}
              p={6}
              borderRadius="lg"
              shadow="md"
              w="full"
            >
              <Heading mb={4} fontSize={"28px"}>
                Rules
              </Heading>
              <List spacing={3}>
                {currentListing?.rules?.length > 0 ? (
                  currentListing?.rules?.map((rule, index) => (
                    <ListItem key={index} fontSize="md" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      {rule}
                    </ListItem>
                  ))
                ) : (
                  <Text>No rules Defined</Text>
                )}
              </List>
            </Box>
          </VStack>

          {/* Comments and Reviews displayed on bottom of page  in small screens but not displayed in large screens */}
          <Flex
            flexDir={"column"}
            gap={4}
            display={{ base: "flex", md: "none" }}
          >
            <ReviewsInListing />
            <AddCommentsInListing
              toast={toast}
              id={id}
              currentID={currentListing?._id}
            />
          </Flex>
        </Grid>
      </Box>
    </Box>
  );
};

export default ListingDetails;
