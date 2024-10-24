import React from 'react'
import { Calendar, CreditCard, MessageSquare, Search as SearchIcon } from 'lucide-react'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Badge, VStack, Flex, Spacer } from '@chakra-ui/react'

export default function UserDash() {
  const upcomingRentals = [
    { id: 1, item: 'Luxury Sedan', owner: 'Car Rentals Inc.', startDate: '2023-05-20', endDate: '2023-05-23', status: 'Confirmed' },
    { id: 2, item: 'Beachfront Apartment', owner: 'Coastal Properties', startDate: '2023-06-15', endDate: '2023-06-22', status: 'Pending' },
  ]

  const recentActivity = [
    { id: 1, action: 'Booked Luxury Sedan', date: '2023-05-10' },
    { id: 2, action: 'Left a review for Mountain Bike', date: '2023-05-05' },
    { id: 3, action: 'Cancelled Hotel Booking', date: '2023-04-30' },
  ]

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Box maxW="6xl" mx="auto">
        <Heading as="h1" size="lg" mb={8}>
          Renter Dashboard
        </Heading>
        
        {/* Cards for Summary Info */}
        <Flex wrap="wrap" gap={6} mb={8}>
          <Card flex="1" minW="200px">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="sm">Upcoming Rentals</Heading>
                <Calendar size={16} color="gray" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">2</Text>
              <Text fontSize="xs" color="gray.500">Next rental in 5 days</Text>
            </CardBody>
          </Card>

          <Card flex="1" minW="200px">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="sm">Total Spent</Heading>
                <CreditCard size={16} color="gray" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">$1,234.56</Text>
              <Text fontSize="xs" color="gray.500">+$340.00 from last month</Text>
            </CardBody>
          </Card>

          <Card flex="1" minW="200px">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="sm">Messages</Heading>
                <MessageSquare size={16} color="gray" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">3</Text>
              <Text fontSize="xs" color="gray.500">2 unread messages</Text>
            </CardBody>
          </Card>

          <Card flex="1" minW="200px">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="sm">Saved Searches</Heading>
                <SearchIcon size={16} color="gray" />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl" fontWeight="bold">5</Text>
              <Text fontSize="xs" color="gray.500">2 new matches this week</Text>
            </CardBody>
          </Card>
        </Flex>

        {/* Upcoming Rentals Table */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          <Card flex="1">
            <CardHeader>
              <Heading size="md">Upcoming Rentals</Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Item</Th>
                      <Th>Owner</Th>
                      <Th>Dates</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {upcomingRentals.map((rental) => (
                      <Tr key={rental.id}>
                        <Td fontWeight="medium">{rental.item}</Td>
                        <Td>{rental.owner}</Td>
                        <Td>{`${rental.startDate} - ${rental.endDate}`}</Td>
                        <Td>
                          <Badge colorScheme={rental.status === 'Confirmed' ? 'green' : 'yellow'}>
                            {rental.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
            <CardFooter>
              <Button w="full" bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}}>View All Rentals</Button>
            </CardFooter>
          </Card>

          {/* Recent Activity List */}
          <Card flex="1">
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
              <Text color="gray.500" fontSize="sm">Your latest actions and updates</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentActivity.map((activity) => (
                  <Flex key={activity.id} justify="space-between">
                    <Text>{activity.action}</Text>
                    <Text color="gray.500" fontSize="sm">{activity.date}</Text>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
            <CardFooter>
              <Button  w="full" bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}}>View Full Activity Log</Button>
            </CardFooter>
          </Card>
        </Flex>

        {/* Start New Search Button */}
        <Box mt={8} display="flex" justifyContent="center">
          <Button leftIcon={<SearchIcon size={16} />} colorScheme="teal">
            Start New Search
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
