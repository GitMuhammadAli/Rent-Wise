import React from 'react';
import { DollarSign, Users, Package, AlertCircle, BarChart2, Plus } from 'lucide-react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, SimpleGrid, Stack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';

export default function OwnerDash() {
  const recentBookings = [
    { id: 1, item: 'Luxury Sedan', renter: 'John Doe', startDate: '2023-05-20', endDate: '2023-05-23', status: 'Active' },
    { id: 2, item: 'Mountain Bike', renter: 'Jane Smith', startDate: '2023-05-25', endDate: '2023-05-26', status: 'Upcoming' },
    { id: 3, item: 'Apartment', renter: 'Bob Johnson', startDate: '2023-06-01', endDate: '2023-06-30', status: 'Upcoming' },
  ];

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Box maxW="6xl" mx="auto">
        <Heading as="h1" size="lg" mb={8}>
          Owner Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="sm">
                  Total Revenue
                </Heading>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">
                $4,231.89
              </Text>
              <Text fontSize="xs" color="gray.500">
                +20.1% from last month
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="sm">
                  Active Rentals
                </Heading>
                <Users className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">
                +573
              </Text>
              <Text fontSize="xs" color="gray.500">
                +201 since last week
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="sm">
                  Listed Items
                </Heading>
                <Package className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">
                12
              </Text>
              <Text fontSize="xs" color="gray.500">
                +2 new listings this month
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="sm">
                  Pending Reviews
                </Heading>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">
                7
              </Text>
              <Text fontSize="xs" color="gray.500">
                +3 this week
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Card>
            <CardHeader>
              <Heading as="h2" size="md">
                Recent Bookings
              </Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th>Renter</Th>
                    <Th>Dates</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentBookings.map((booking) => (
                    <Tr key={booking.id}>
                      <Td fontWeight="medium">{booking.item}</Td>
                      <Td>{booking.renter}</Td>
                      <Td>{`${booking.startDate} - ${booking.endDate}`}</Td>
                      <Td>
                        <Text
                          display="inline-flex"
                          alignItems="center"
                          px={2.5}
                          py={0.5}
                          rounded="full"
                          fontSize="xs"
                          fontWeight="medium"
                          colorScheme={booking.status === 'Active' ? 'green' : 'blue'}
                          bg={booking.status === 'Active' ? 'green.100' : 'blue.100'}
                        >
                          {booking.status}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
            <CardFooter>
              <Button bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}} variant="outline" width="full">
                View All Bookings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Heading as="h2" size="md">
                Performance Overview
              </Heading>
              <Text color="gray.500">Your rental performance for the last 30 days</Text>
            </CardHeader>
            <CardBody>
              <Flex height="200px" align="center" justify="center" bg="gray.100" rounded="md">
                <BarChart2 className="h-16 w-16 text-gray-400" />
              </Flex>
            </CardBody>
            <CardFooter>
              <Button bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}} variant="outline" width="full">
                View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>

        <Box mt={8} display="flex" justifyContent="center">
          <Button bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}} leftIcon={<Plus className="h-4 w-4" />} colorScheme="teal">
            Add New Listing
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
