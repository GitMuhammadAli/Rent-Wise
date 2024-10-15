import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Grid, Heading, Icon, Text, Image, Input } from '@chakra-ui/react';
import { ArrowForwardIcon, StarIcon, SearchIcon } from '@chakra-ui/icons';
import { getAllListing } from "../../src/Api/ListingApi"; 
import { Link } from 'react-router-dom';
import { FaCar, FaBicycle, FaBuilding, FaHotel } from 'react-icons/fa';

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

  const categories = [
    { name: 'Cars', icon: FaCar, description: 'Rent a wide variety of cars for any occasion' },
    { name: 'Bikes', icon: FaBicycle, description: 'Explore on two wheels with our bike rentals' },
    { name: 'Apartments', icon: FaBuilding, description: 'Find your perfect temporary home' },
    { name: 'Hotels', icon: FaHotel, description: 'Book luxurious stays for your travels' },
  ];

  const featuredRentals = [
    { id: 1, name: 'Luxury Sedan', category: 'Cars', price: '$80/day', rating: 4.8, image: '/images/sedan.jpeg?' },
    { id: 2, name: 'Mountain Bike', category: 'Bikes', price: '$25/day', rating: 4.6, image: '/images/mb.jpeg?' },
    { id: 3, name: 'Beachfront Apartment', category: 'Apartments', price: '$150/night', rating: 4.9, image: '/images/apart.jpeg?' },
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
          <Heading as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
            Popular Categories
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
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
                  <Button variant="link" as={Link} to={`/category/${category.name.toLowerCase()}`} colorScheme="blue" rightIcon={<ArrowForwardIcon />}>
                    Browse {category.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Featured Listings Section */}
        <Box mb={12}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={6} color="gray.800">
            Featured Rentals
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {listing.map((rental) => (
              <Card key={rental._id} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                <CardHeader p={0}>
                  <Image src={rental.image} alt={rental.name} width="100%" height="200px" objectFit="cover" borderRadius="md" />
                </CardHeader>
                <CardBody>
                  <Heading as="h3" size="md" mb={2}>{rental.title}</Heading>
                  <Text>{rental.category}</Text>
                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontWeight="bold">{rental.price}  PKR</Text>
                    <Flex align="center">
                      <StarIcon color="yellow.400" mr={1} />
                      <Text>{rental.averageRating}</Text>
                    </Flex>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Button as={Link} to={`/rental/${rental.id}`} bg={'black'} color={'white'} _hover={{ color: 'black', background: 'white', border: '1px solid black' }} w="full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Dynamic Listings Section */}
      </Box>
    </Box>
  );
}
