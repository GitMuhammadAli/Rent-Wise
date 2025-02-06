import React, { useEffect, useState } from 'react'
import { getAllCar } from '../../../Api/Home';
import { Box, Card, CardFooter, CardHeader, Heading, Input, Slider,Button, Flex, Stack, Skeleton } from '@chakra-ui/react';
import { Bath, BedDouble, DollarSign, MapPin } from 'lucide-react';
import {Link} from 'react-router-dom'

export default function CarListing() {
  const [priceRange, setPriceRange] = useState([0, 1500000])
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(()=>{
        const fetchCarListings = async()=>{
          try {
            const response = await getAllCar();
            console.log("res of car", response.data.data);
            setCarData(response?.data?.data);
            
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
      
        }
         
        }
        fetchCarListings();
  
    },[])

    const handleMinChange = (e) => {
      const value = Number(e.target.value);
      if (value <= maxPrice) setMinPrice(value);
    };

    const handleMaxChange = (e) => {
      const value = Number(e.target.value);
      if (value >= minPrice) setMaxPrice(value);
    };

    const handleSliderChange = (e) => {
      const value = Number(e.target.value);
      setMaxPrice(value);
    };

    const filteredListings = carData.filter(
      (car) => car.price >= minPrice && car.price <= maxPrice 
      


    );

    useEffect(()=>{
    console.log('carD', carData)
    },[carData])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-800">Discover Your Dream Cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full lg:w-1/4">
          <Card boxShadow={'lg'}>
            <CardHeader className="bg-orange-500 text-white">
              <Heading>Find Your Perfect Car</Heading>
            </CardHeader>
            <Box p={6}>
              <div>
                <Flex flexDir={'column'} gap={3} mb={5}>
                <label htmlFor="price" className="text-orange-800 font-semibold">Price Range</label>
                <input
        type="range"
        min={minPrice}
        max="10000000"
        step="500"
        value={maxPrice}
        onChange={handleSliderChange}
        style={{ width: "100%" }}
      />
                </Flex>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <Input
          type="number"
          value={minPrice}
          onChange={handleMinChange}
          min="0"
          max="10000000"
          style={{ width: "45%", padding: "5px" }}
          placeholder="Min Price"
        />
        <Input
          type="number"
          value={maxPrice}
          onChange={handleMaxChange}
          min="0"
          max="10000000"
          style={{ width: "45%", padding: "5px" }}
          placeholder="Max Price"
        />
      </div>
              </div>
      
             
            </Box>
          </Card>
        </div>

        {/* Main content area with listings */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map(car => (
              <Card key={car._id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white">
                {
                  car?.images.length > 0 ? (
                    <img  src={
                      `${import.meta.env.VITE_BACK_END_URL}${car?.images[0]?.url}` ||
                      '/images/make_listing/random.png'
                    } alt={car.title} className="w-full h-48 object-cover" />  
                  ) : (
                    <img  src={
                      `/images/make_listing/random.png`
                    } alt={car.title} className="w-full h-48 object-cover" />  
                  ) 
                }
                <Box px={2}>
                 <Heading py={2} fontSize={'20px'} fontWeight={'semibold'}>{car.title}</Heading>
                  <Flex gap={1} alignItems={'baseline'}>
                    <span className="text-[20px] font-bold mb-2 flex items-center text-orange-500">{car.price.toLocaleString()} PKR</span>
                    <span className="text-gray-600">/{car.priceUnit}</span>
                    </Flex>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 text-orange-500 mr-1" /> {car?.location || 'Lahore'}
                  </p>
                </Box>
                <CardFooter>
                  <Button as={Link} to={`/rental/${car._id}`} variant={'cutomButton'} className="w-full bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredListings.length === 0 && (
            <Card className="p-8 text-center bg-white">
              <p className="text-orange-800 text-xl">No listings found matching your criteria.</p>
              <p className="text-gray-600 mt-2">Try adjusting your filters to see more results.</p>
            </Card>
          )}

           {loading && 
                  (
                  <Stack mt={10}>
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                  <Skeleton startColor='#F4FFF3' endColor='#f4bf6f' height='20px' />
                </Stack>
                 )
               }
        </div>
      </div>
    </div>
  )
}


