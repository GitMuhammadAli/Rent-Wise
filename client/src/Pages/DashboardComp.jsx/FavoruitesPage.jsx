import React, { useState, useEffect } from 'react'
import { Box, Grid, Text, Image, Badge, VStack, Heading, Button } from '@chakra-ui/react'
import { GetFav } from '../../Api/ListingApi'
import { Link } from 'react-router-dom'
const baseUrl = import.meta.env.VITE_BACK_END_URL;
function FavoruitesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await GetFav()
        setFavorites(response.data.favoriteListings)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching favorites:', error)
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) {
    return <Text>Loading favorites...</Text>
  }

  return (
    <Box p={8}>
      <Heading mb={6}>My Favorite Listings</Heading>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        {favorites.length > 0 ? (
          favorites.map((listing) => (
            <Box 
              key={listing._id} 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              bg="white"
              _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
            >
              <Image
                src={
                    listing?.images && listing?.images?.length > 0
                      ? `${baseUrl}${listing.images[currentImageIndex].url}`
                      : "/images/make_listing/random.png" // Default image path
                  }
                alt={listing.title}
                height="200px"
                width="100%"
                objectFit="cover"
              />
              
              <VStack p={4} align="start" spacing={2}>
                <Heading size="md">{listing.title}</Heading>
                <Badge colorScheme="orange">{listing.category}</Badge>
                <Text fontSize="xl" fontWeight="bold">
                  ${listing.price}/{listing.priceUnit}
                </Text>
                <Text noOfLines={2}>{listing.description}</Text>
                
                <Button 
                  as={Link}
                  to={`/listing/${listing._id}`}
                  colorScheme="orange"
                  width="full"
                >
                  View Details
                </Button>
              </VStack>
            </Box>
          ))
        ) : (
          <Text fontSize="lg" color="gray.600">
            You haven't added any listings to your favorites yet.
          </Text>
        )}
      </Grid>
    </Box>
  )
}

export default FavoruitesPage