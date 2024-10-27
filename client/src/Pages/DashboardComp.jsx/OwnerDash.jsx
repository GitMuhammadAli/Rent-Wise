import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Package, AlertCircle, BarChart2, Plus, Edit } from 'lucide-react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, SimpleGrid, Stack, Table, Tbody, Td, Th, Thead, Tr, Text, TableContainer } from '@chakra-ui/react';
import { useDasboardHook } from '../../hooks/DashboardUserContext';
import { getAlListingsofSpecificUser } from '../../Api/ListingApi';
import { Link } from 'react-router-dom';

export default function OwnerDash() {
  const [count, setCount] = useState('');
  const {user,dispatch} = useDasboardHook();
  const [items, setItems] = useState([]);
  const recentBookings = [
    { id: 1, item: 'Luxury Sedan', renter: 'John Doe', startDate: '2023-05-20', endDate: '2023-05-23', status: 'Active' },
    { id: 2, item: 'Mountain Bike', renter: 'Jane Smith', startDate: '2023-05-25', endDate: '2023-05-26', status: 'Upcoming' },
    { id: 3, item: 'Apartment', renter: 'Bob Johnson', startDate: '2023-06-01', endDate: '2023-06-30', status: 'Upcoming' },
  ];

  useEffect(()=>{
    async function getOwnerListings(){
      if (user && user._id) {
        const user_id = user._id;
        console.log("User id is:", user_id)

        const response = await getAlListingsofSpecificUser(user_id)
        console.log("Response of user in ownerdash is: ", response.data);
        setCount(response.data.count)

        setItems(response.data.listing);
        console.log("listing in ownerdash are:" , response.data.listing);
      }
    }
    getOwnerListings();
  },[user])

  return (
    <Box minH="100vh" bg="gray.100" p={{ base: 2, sm: 4, md: 8 }}>
      <Box maxW="7xl" mx="auto">
        <Heading as="h1" size={{ base: "md", sm: "lg", md: "xl" }} mb={{ base: 3, sm: 4, md: 8 }}>
          Owner Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 3, sm: 4, md: 6 }} mb={{ base: 3, sm: 4, md: 8 }}>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Total Revenue
                </Heading>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold">
                $4,231.89
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                +20.1% from last month
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Active Rentals
                </Heading>
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold">
                +573
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                +201 since last week
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Listed Items
                </Heading>
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              {count && count > 0 ? (
                <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold">
                  {count}
                </Text>
              ) : (
                <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold">
                  0
                </Text>
              )}
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                +2 new listings this month
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size={{ base: "xs", sm: "sm" }}>
                  Pending Reviews
                </Heading>
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </Flex>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold">
                7
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
                +3 this week
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1 }} spacing={{ base: 3, sm: 4, md: 8 }}>
          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Heading as="h2" size={{ base: "xs", sm: "sm", md: "md" }}>
                Listings
              </Heading>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <TableContainer overflowX="auto">
                <Table variant="simple" size={{ base: "sm", md: "md" }}>
                  <Thead>
                    <Tr>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Title</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Description</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Category</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Status</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Price</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Amenities</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>AVG Rating</Th>
                      <Th fontSize={{ base: "xs", sm: "sm" }}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items && items.length > 0 && items.map((booking,index) => (
                      <Tr key={index}>
                        <Td fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium">{booking.title}</Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }} maxW={{ base: "100px", sm: "150px", md: "200px" }} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{booking.description}</Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }}>{booking.category}</Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }}>
                          <Text
                            display="inline-flex"
                            alignItems="center"
                            px={2}
                            py={0.5}
                            rounded="full"
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="medium"
                            colorScheme={booking.status === 'Active' ? 'green' : 'blue'}
                            bg={booking.status === 'Active' ? 'green.100' : 'blue.100'}
                          >
                            {booking.status}
                          </Text>
                        </Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }}>{booking.price}</Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }} maxW={{ base: "100px", sm: "150px", md: "200px" }} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                          {booking.amenities && 
                            <Text>
                              {(booking.amenities).join(',')}
                            </Text>
                          }
                        </Td>
                        <Td fontSize={{ base: "xs", sm: "sm" }}>{booking.averageRating}</Td>
                        <Td>
                          <Link to={`/listings/${booking._id}`}>
                            <Button variant="ghost" size={{ base: "xs", sm: "sm" }}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter p={{ base: 2, sm: 3, md: 4 }}>
              <Button bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}} variant="outline" width="full" size={{ base: "xs", sm: "sm", md: "md" }}>
                View All Bookings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader p={{ base: 2, sm: 3, md: 4 }}>
              <Heading as="h2" size={{ base: "xs", sm: "sm", md: "md" }}>
                Performance Overview
              </Heading>
              <Text color="gray.500" fontSize={{ base: "xs", sm: "sm", md: "md" }}>Your rental performance for the last 30 days</Text>
            </CardHeader>
            <CardBody p={{ base: 2, sm: 3, md: 4 }}>
              <Flex height={{ base: "100px", sm: "150px", md: "200px" }} align="center" justify="center" bg="gray.100" rounded="md">
                <BarChart2 className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400" />
              </Flex>
            </CardBody>
            <CardFooter p={{ base: 2, sm: 3, md: 4 }}>
              <Button bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}} variant="outline" width="full" size={{ base: "xs", sm: "sm", md: "md" }}>
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>

        <Box mt={{ base: 3, sm: 4, md: 8 }} display="flex" justifyContent="center">
          <Link to={"/media"}>
            <Button 
              bg={'rgb(41, 39, 39)'} 
              color={'white'} 
              _hover={{color:'black',background:'none',border:'1px solid black'}} 
              leftIcon={<Plus className="h-3 w-3 sm:h-4 sm:w-4" />} 
              colorScheme="teal"
              size={{ base: "xs", sm: "sm", md: "md" }}
            >
              Add New Listing
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}