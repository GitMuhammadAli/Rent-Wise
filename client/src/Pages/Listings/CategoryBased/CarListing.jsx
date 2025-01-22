import React, { useEffect, useState } from 'react'
import { getAllCar } from '../../../Api/Home'
import { Box, Button,Flex, Link ,Input, Select, Slider, Text, VStack, HStack, Grid, GridItem, Card, CardHeader, CardBody, CardFooter, Image, SliderTrack, SliderFilledTrack, SliderThumb, Heading } from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';

export default function CarListing() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [category, setCategory] = useState("All")
  const [carsData, setCarsData] = useState([]);



  useEffect(()=>{
      const fetchCarListings = async()=>{
        try {
          const response = await getAllCar();
          console.log("res of car", response.data.data);
          setCarsData(response?.data?.data);
          
        } catch (error) {
          console.log(error);
        }
       
      }
      fetchCarListings();

  },[])

  const filteredCars = carsData.filter(
    (car) =>
      (car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      car.price >= priceRange[0] &&
      car.price <= priceRange[1] &&
      (category === "All" || car.category === category),
  )

  return (
    <Box bg="background" minHeight="100vh" py={8}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
        <VStack spacing={8}>
          <Text fontSize="4xl" fontWeight="bold" textAlign="center">
            Find Your Perfect Ride
          </Text>
  
          <HStack spacing={4} justify="center" w={'70%'} >
            <Input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              flex="1"
            />
            <Button leftIcon={<SearchIcon boxSize={5} />} colorScheme="teal">
              Search
            </Button>
          </HStack>
  
          <HStack
            spacing={6}
            align="start"
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            width="100%"
          >
            <Card width={{ base: '100%', lg: '25%' }} p={4}>
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold">
                  Filters
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </Text>
                    <Slider
                      min={0}
                      max={500000}
                      step={1000}
                      value={[priceRange[1]]}
                      onChange={(value) => setPriceRange([priceRange[0], value[0]])}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Category
                    </Text>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="All">All Categories</option>
                      <option value="Electric">Electric</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Sports">Sports</option>
                      <option value="SUV">SUV</option>
                    </Select>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
  
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} width="100%">
              {carsData.map((rental) => (
                <Card key={rental._id} _hover={{ boxShadow: 'lg' }} transition="box-shadow 0.3s">
                  <CardHeader p={0}>
                    {rental.images && rental.images.length > 0 ? (
                      <Image
                        src={`${import.meta.env.VITE_BACK_END_URL}${rental.images[0].url}`}
                        alt ={rental.title}
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
                        src="/images/make_listing/random.png"
                        alt="No Image Available"
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
                      w="full"
                      variant="customButton"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
  
  
}



 