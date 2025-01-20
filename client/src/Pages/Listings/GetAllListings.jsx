import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Grid, Heading, Icon, Text, Image, Input } from '@chakra-ui/react';
import { ArrowForwardIcon, StarIcon, SearchIcon } from '@chakra-ui/icons';
import { getAllListingAPI } from "../../Api/ListingApi"; 
import { Link } from 'react-router-dom';
import { FaCar, FaBicycle, FaBuilding, FaHotel } from 'react-icons/fa';
import { ListingsContext } from '../../hooks/ListingsContext';

export default function GetAllListings() {
  const { state, dispatch } = useContext(ListingsContext); 
  const { listings } = state; 
  const itemsPerPage = 5 // Number of listings per page
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(listings.length / itemsPerPage);

    // Get the listings for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const curentListing = listings.slice(startIndex, endIndex);

    const goToNextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const goToPrevPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllListingAPI();
        console.log("Response is: ", response.data);
        
        dispatch({ type: 'GET_LISTINGS', payload: response.data });
       
        
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }

    fetchData();
  }, [dispatch]);

  useEffect(()=>{
    console.log("Current listings in get state in getAll:", listings)
  },[listings])

  const categories = [
    { name: 'House', icon: FaBuilding, description: 'Explore on two wheels with our bike rentals' },
    { name: 'Cars', icon: FaCar, description: 'Rent a wide variety of cars for any occasion' },
    // { name: 'Apartments', icon: FaBuilding, description: 'Find your perfect temporary home' },
    { name: 'Hostels', icon: FaHotel, description: 'Book luxurious stays for your travels' },
  ];

  return (
    <Box minH="100vh" bg="rgb(231, 231, 231)" py={6} w={'100%'}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Heading */}
        <Box textAlign="center" mb={12}>
          <Heading as="h1" size="2xl" fontWeight="extrabold" color="gray.800">
            Available Listings
          </Heading>
        </Box>

        {/* Search Bar */}
        <Box maxW="3xl" mx="auto" mb={12}>
          <Flex mb={4}>
            <Input placeholder="What would you like to rent?" flex="1" mr={2} bg={'white'} />
            <Button leftIcon={<SearchIcon />} size="md" colorScheme="blue">
              Search
            </Button>
          </Flex>
        </Box>

        {/* Categories Section */}
        <Box mb={12}>
          <Heading  as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
           Categories
          </Heading>
          <Flex display={'flex'} justifyContent={'center'}  gap={{base:"4",md:'10'}} flexDir={{base:"column",md:'row'}}>
          {/* templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} */}
            {categories.map((category) => (
              <Card key={category.name} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                <CardHeader>
                  <Flex align="center">
                    <Icon as={category.icon} boxSize={6} color="blue.500" mr={3} />
                    <Heading as="h3" size="md">{category.name}</Heading>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text>{category.description}</Text>
                </CardBody>
                <CardFooter>
                  <Button variant="link" as={Link} to={`/categories/${category.name.toLowerCase()}`} colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
                    Browse {category.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Flex>
        </Box>

        {/* Featured Listings Section */}
        <Box mb={12}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
            Featured Rentals
          </Heading>
          
          {curentListing && curentListing.length > 0 ? (
            <>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {curentListing.map((rental) => (
                <Card key={rental._id} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                  <CardHeader p={0}>
                    {rental.images && rental.images.length > 0 ? (
                      <Image
                        src={`http://localhost:3600${rental.images[0].url}`}
                        alt={rental.title}
                        width="100%"
                        height="200px"
                        objectFit="cover"
                        borderRadius="md"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'images/make_listing/random.png'; 
                        }}
                      />
                    ) : (
                      <Image
                        src='images/make_listing/random.png' 
                        alt='No Image Available'
                        width="100%"
                        height="200px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}
                  </CardHeader>
                  <CardBody>
                    <Heading as="h3" size="md" mb={2}>
                      {rental.title}
                    </Heading>
                    <Text>{rental.category}</Text>
                    <Flex justify="space-between" align="center" mt={2}>
                      <Text fontWeight="bold">{rental.price} PKR</Text>
                      <Flex align="center">
                        <StarIcon color="yellow.400" mr={1} />
                        <Text>{rental.averageRating}</Text>
                      </Flex>
                    </Flex>
                  </CardBody>
                  <CardFooter>
                    <Button
                      as={Link}
                      to={`/rental/${rental._id}`}
                      // bg={'black'}
                      // color={'white'}
                      // _hover={{ color: 'black', background: 'white', border: '1px solid black' }}
                      w="full"
                      variant={'customButton'}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
             <Flex mt={10} alignItems={'center'}  justifyContent={'space-between'}>
             <Button onClick={goToPrevPage} isDisabled={currentPage === 1}>
             Previous
            </Button>
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
            <Button onClick={goToNextPage} isDisabled={currentPage === totalPages}>
            Next
            </Button>
         </Flex>
         </>
          ) : (
            <Text>Loading...</Text> 
          )}
        </Box>
      </Box>
    </Box>
  );
}
