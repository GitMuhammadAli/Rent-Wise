import React, { useEffect, useState } from 'react'
import { getAllCar } from '../../../Api/Home'
import { Box, Button, Input, Select, Slider, Text, VStack, HStack, Grid, GridItem, Card, CardHeader, CardBody, CardFooter, Image, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
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
      <Box maxW="7xl" mx="auto" px={4}>
        <VStack spacing={8}>
          <Text fontSize="4xl" fontWeight="bold">
            Find Your Perfect Ride
          </Text>

          <HStack spacing={4}>
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

          <HStack spacing={6} align="start" direction={{ base: 'column', lg: 'row' }}>
            <Card width={{ base: '100%', lg: '25%' }}>
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
                      max={200}
                      step={10}
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
              {carsData.map((car) => (
                <Card key={car._id} borderWidth={1} borderRadius="lg" boxShadow="md">
                  <Image src={car.image || '/placeholder.svg'} alt={car.title} boxSize="full" objectFit="cover" />
                  <CardHeader>
                    <Text fontSize="lg" fontWeight="bold">{car.title}</Text>
                  </CardHeader>
                  <CardBody>
                    <Text noOfLines={2} color="gray.500" mb={2}>
                      {car.description}
                    </Text>
                    <HStack justify="space-between" align="center" mb={2}>
                      <Text bg="teal.500" color="white" px={2} py={1} borderRadius="full" fontSize="sm" fontWeight="semibold">
                        ${car.price}/day
                      </Text>
                      <HStack spacing={1} align="center">
                        <StarIcon boxSize={4} color="yellow.400" />
                        <Text fontSize="sm" color="gray.500">
                          {car.rating} ({car.reviews})
                        </Text>
                      </HStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">{car.location}</Text>
                  </CardBody>
                  <CardFooter>
                    <Button width="full" colorScheme="teal">
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
