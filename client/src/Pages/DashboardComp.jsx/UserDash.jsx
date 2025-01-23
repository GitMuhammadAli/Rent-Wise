// import React from 'react'
// import { Calendar, CreditCard, MessageSquare, Search as SearchIcon } from 'lucide-react'
// import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Text, Badge, VStack, Flex, Spacer } from '@chakra-ui/react'

// export default function UserDash() {
//   const upcomingRentals = [
//     { id: 1, item: 'Luxury Sedan', owner: 'Car Rentals Inc.', startDate: '2023-05-20', endDate: '2023-05-23', status: 'Confirmed' },
//     { id: 2, item: 'Beachfront Apartment', owner: 'Coastal Properties', startDate: '2023-06-15', endDate: '2023-06-22', status: 'Pending' },
//   ]

//   const recentActivity = [
//     { id: 1, action: 'Booked Luxury Sedan', date: '2023-05-10' },
//     { id: 2, action: 'Left a review for Mountain Bike', date: '2023-05-05' },
//     { id: 3, action: 'Cancelled Hotel Booking', date: '2023-04-30' },
//   ]

//   return (
//     <Box  minH="100vh" bg="whiteAlpha.800" p={8}>
//       <Box maxW="6xl" mx="auto">
//         <Heading as="h1" size="lg" mb={8}>
//           Renter Dashboard
//         </Heading>
        
//         {/* Cards for Summary Info */}
//         <Flex wrap="wrap" gap={6} mb={8}>
//           <Card boxShadow={"2xl"} flex="1" minW="200px">
//             <CardHeader>
//               <Flex justify="space-between" align="center">
//                 <Heading size="sm">Upcoming Rentals</Heading>
//                 <Calendar size={16} color="gray" />
//               </Flex>
//             </CardHeader>
//             <CardBody>
//               <Text fontSize="2xl" fontWeight="bold">2</Text>
//               <Text fontSize="xs" color="gray.500">Next rental in 5 days</Text>
//             </CardBody>
//           </Card>

//           <Card boxShadow={"2xl"} flex="1" minW="200px">
//             <CardHeader>
//               <Flex justify="space-between" align="center">
//                 <Heading size="sm">Total Spent</Heading>
//                 <CreditCard size={16} color="gray" />
//               </Flex>
//             </CardHeader>
//             <CardBody>
//               <Text fontSize="2xl" fontWeight="bold">$1,234.56</Text>
//               <Text fontSize="xs" color="gray.500">+$340.00 from last month</Text>
//             </CardBody>
//           </Card>

//           <Card boxShadow={"2xl"} flex="1" minW="200px">
//             <CardHeader>
//               <Flex justify="space-between" align="center">
//                 <Heading size="sm">Messages</Heading>
//                 <MessageSquare size={16} color="gray" />
//               </Flex>
//             </CardHeader>
//             <CardBody>
//               <Text fontSize="2xl" fontWeight="bold">3</Text>
//               <Text fontSize="xs" color="gray.500">2 unread messages</Text>
//             </CardBody>
//           </Card>

//           <Card boxShadow={"2xl"} flex="1" minW="200px">
//             <CardHeader>
//               <Flex justify="space-between" align="center">
//                 <Heading size="sm">Saved Searches</Heading>
//                 <SearchIcon size={16} color="gray" />
//               </Flex>
//             </CardHeader>
//             <CardBody>
//               <Text fontSize="2xl" fontWeight="bold">5</Text>
//               <Text fontSize="xs" color="gray.500">2 new matches this week</Text>
//             </CardBody>
//           </Card>
//         </Flex>

//         {/* Upcoming Rentals Table */}
//         <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
//           <Card flex="1">
//             <CardHeader>
//               <Heading size="md">Upcoming Rentals</Heading>
//             </CardHeader>
//             <CardBody>
//               <TableContainer>
//                 <Table variant="simple">
//                   <Thead>
//                     <Tr>
//                       <Th>Item</Th>
//                       <Th>Owner</Th>
//                       <Th>Dates</Th>
//                       <Th>Status</Th>
//                     </Tr>
//                   </Thead>
//                   <Tbody>
//                     {upcomingRentals.map((rental) => (
//                       <Tr key={rental.id}>
//                         <Td fontWeight="medium">{rental.item}</Td>
//                         <Td>{rental.owner}</Td>
//                         <Td>{`${rental.startDate} - ${rental.endDate}`}</Td>
//                         <Td>
//                           <Badge colorScheme={rental.status === 'Confirmed' ? 'green' : 'yellow'}>
//                             {rental.status}
//                           </Badge>
//                         </Td>
//                       </Tr>
//                     ))}
//                   </Tbody>
//                 </Table>
//               </TableContainer>
//             </CardBody>
//             <CardFooter>
//               <Button w="full" bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}}>View All Rentals</Button>
//             </CardFooter>
//           </Card>

//           {/* Recent Activity List */}
//           <Card flex="1">
//             <CardHeader>
//               <Heading size="md">Recent Activity</Heading>
//               <Text color="gray.500" fontSize="sm">Your latest actions and updates</Text>
//             </CardHeader>
//             <CardBody>
//               <VStack spacing={4} align="stretch">
//                 {recentActivity.map((activity) => (
//                   <Flex key={activity.id} justify="space-between">
//                     <Text>{activity.action}</Text>
//                     <Text color="gray.500" fontSize="sm">{activity.date}</Text>
//                   </Flex>
//                 ))}
//               </VStack>
//             </CardBody>
//             <CardFooter>
//               <Button  w="full" bg={'rgb(41, 39, 39)'} color={'white'} _hover={{color:'black',background:'none',border:'1px solid black'}}>View Full Activity Log</Button>
//             </CardFooter>
//           </Card>
//         </Flex>

//         {/* Start New Search Button */}
//         <Box mt={8} display="flex" justifyContent="center">
//           <Button leftIcon={<SearchIcon size={16} />} colorScheme="teal">
//             Start New Search
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

import React, { useEffect, useState } from 'react'
import {  Text, VStack, Flex, Icon, Button, Box, Badge , Table, Thead, Tbody, Tr, Th, Td,} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Calendar, CreditCard, MessageSquare, SearchIcon, FileText, Star, User } from 'lucide-react'
import { fetchAllRenterAggreements } from '../../Api/renter';
import { ToGetReview } from '../../Api/DashboardAPI';
import { Link } from 'react-router-dom';




export default function UserDash() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agreementDetail, setAgreementDetail] = useState([]);


  const upcomingRentals = [
    { id: 1, item: 'Luxury Sedan', owner: 'Car Rentals Inc.', startDate: '2023-05-20', endDate: '2023-05-23', status: 'Confirmed' },
    { id: 2, item: 'Beachfront Apartment', owner: 'Coastal Properties', startDate: '2023-06-15', endDate: '2023-06-22', status: 'Pending' },
  ]

  const recentActivity= [
    { id: 1, action: 'Booked Luxury Sedan', date: '2023-05-10' },
    { id: 2, action: 'Left a review for Mountain Bike', date: '2023-05-05' },
    { id: 3, action: 'Cancelled Hotel Booking', date: '2023-04-30' },
  ]

  const reviews= [
    { id: 1, item: 'Luxury Sedan', owner: 'Car Rentals Inc.', rating: 4, comment: 'Great car, smooth ride!', date: '2023-05-24' },
    { id: 2, item: 'Mountain Bike', owner: 'Adventure Rentals', rating: 5, comment: 'Excellent bike and service!', date: '2023-04-13' },
  ]


  useEffect(()=>{

    const funcToGetReview = async()=>{
      try {
        const response = await ToGetReview();
        console.log("review peoples", response);
        const reviewData = response?.data || [];
        setAgreementDetail(reviewData);
        
      } catch (error) {
        console.log(error)
        
      }

    }

    funcToGetReview()

  },[])

  useEffect(()=>{

    const fetchAggreements = async() =>{
      try {
        const response = await fetchAllRenterAggreements()
        console.log("res aggr", response)
      
        const listingName = response.data.data.aggreements.map((aggr)=> aggr.listingId);
        const OwnerName = response.data.data.aggreements.map((aggr)=> aggr.ownerId);
        const startDate = response.data.data.aggreements.map((aggr)=> aggr.agreementDetailsId.aggrementDetail.startDate);
        const endDate = response.data.data.aggreements.map((aggr)=> aggr.agreementDetailsId.aggrementDetail.endDate);
        const status = response.data.data.aggreements.map((aggr)=> aggr.agreementDetailsId.aggrementDetail.agreementStatus);
        setAgreementDetail(response?.data?.data?.aggreements)
        
        
      } catch (error) {
        console.log(error)
        
      }

    }

    fetchAggreements();

    },[])

    useEffect(()=>{
      console.log("aggrDetaii", agreementDetail)

    },[agreementDetail])

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Upcoming Rentals" icon={Calendar} value="2" subtext="Next rental in 5 days" />
        <DashboardCard title="Total Spent" icon={CreditCard} value="$1,234.56" subtext="+$340.00 from last month" />
        <DashboardCard title="Messages" icon={MessageSquare} value="3" subtext="2 unread messages" />
        <DashboardCard title="Saved Searches" icon={SearchIcon} value="5" subtext="2 new matches this week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Rentals</h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Owner</th>
                  <th className="pb-2">Dates</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRentals.map((rental) => (
                  <tr key={rental.id} className="border-t border-gray-200">
                    <td className="py-3 font-medium">{rental.item}</td>
                    <td className="py-3">{rental.owner}</td>
                    <td className="py-3">{`${rental.startDate} - ${rental.endDate}`}</td>
                    <td className="py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rental.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
              View All Rentals
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">Your latest actions and updates</p>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex justify-between items-center">
                  <span>{activity.action}</span>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors">
              View Full Activity Log
            </button>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors flex items-center">
          <SearchIcon size={16} className="mr-2" />
          Start New Search
        </button>
      </div> */}
    </>
  )

  const renderAgreements = () => {

   

    return (
      <Box bg="white" borderRadius="lg" shadow="lg" overflow="hidden">
        <Box px={6} py={4} bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
          <Text fontSize="lg" fontWeight="semibold" color="gray.900">
            Rental Agreements
          </Text>
        </Box>
  
        <Box p={6}>
          <Table width="full">
            <Thead>
              <Tr>
                <Th pb={2} textTransform="uppercase" fontSize="xs" fontWeight="medium" color="gray.500">
                  List Title
                </Th>
                <Th pb={2} textTransform="uppercase" fontSize="xs" fontWeight="medium" color="gray.500">
                  Owner
                </Th>
                <Th pb={2} textTransform="uppercase" fontSize="xs" fontWeight="medium" color="gray.500">
                  Dates
                </Th>
                <Th pb={2} textTransform="uppercase" fontSize="xs" fontWeight="medium" color="gray.500">
                  Status
                </Th>
                <Th pb={2} textTransform="uppercase" fontSize="xs" fontWeight="medium" color="gray.500">
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              { agreementDetail && agreementDetail.length > 0 ? ( 
                agreementDetail?.map((agreement) => (
                  <Tr key={agreement._id} borderTopWidth="1px" borderColor="gray.200">
                    <Td py={3} fontWeight="medium">
                      {agreement?.listingId?.title}
                    </Td>
                    <Td py={3}>{agreement.ownerId.name}</Td>
                    <Td py={3}>{`${agreement?.agreementDetailsId?.aggrementDetail.startDate} - 
                    ${agreement?.agreementDetailsId?.aggrementDetail.endDate}`}</Td>
                    <Td py={3}>
                      <Badge
                        px={2}
                        fontSize="xs"
                        fontWeight="semibold"
                        borderRadius="full"
                        colorScheme={
                          agreement.agreementStatus === 'active'
                            ? 'green'
                            : agreement.status === 'pending'
                            ? 'yellow'
                            : 'gray'
                        }
                      >
                        {agreement?.agreementStatus}
                    
                      </Badge>
                    </Td>
                    <Td py={3}>
                      <Link
                        to={agreement?.listingId?.category === 'house' ? 
                          `/viewHouseAgreement/${agreement._id}` :
                        agreement?.listingId?.category === 'car' ? 
                        `/viewCarAgreement/${agreement._id}` : 
                        `/viewHostelAgreement/${agreement._id}`
                         }
                        color="blue.600"
                        _hover={{ color: 'blue.800' }}
                        // isExternal
                      >
                        View Agreement
                      </Link>
                      
                    </Td>
                  </Tr>
                ))
              ) : (<Text>No agreement created yet</Text>) }
            </Tbody>
          </Table>
        </Box>
      </Box>
  
    )

  } 


  const renderReviews = () => (
    // <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    //   <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
    //     <h3 className="text-lg font-semibold text-gray-900">Your Reviews</h3>
    //   </div>
    //   <div className="p-6">
    //     <ul className="space-y-6">
    //       {reviews.map((review) => (
    //         <li key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
    //           <div className="flex justify-between items-start mb-2">
    //             <div>
    //               <h4 className="font-semibold text-lg">{review.item}</h4>
    //               <p className="text-sm text-gray-600">Owner: {review.owner}</p>
    //             </div>
    //             <div className="flex items-center">
    //               {[...Array(5)].map((_, i) => (
    //                 <Star 
    //                   key={i} 
    //                   size={16} 
    //                   className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} 
    //                   fill={i < review.rating ? 'currentColor' : 'none'}
    //                 />
    //               ))}
    //             </div>
    //           </div>
    //           <p className="text-gray-700 mb-2">{review.comment}</p>
    //           <p className="text-sm text-gray-500">Reviewed on {review.date}</p>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    //   <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
    //     <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
    //       Write a New Review
    //     </button>
    //   </div>
    // </div>

    <Box bg="white" rounded="lg" shadow="lg" overflow="hidden">
    <Box px={6} py={4} bg="gray.50" borderBottom="1px" borderColor="gray.200">
      <Text fontSize="lg" fontWeight="semibold" color="gray.900">
        Your Reviews
      </Text>
    </Box>
  
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {reviews.map((review) => (
          <Box
            key={review.id}
            borderBottom="1px"
            borderColor="gray.200"
            pb={6}
            _last={{ borderBottom: 'none', pb: 0 }}
          >
            <Flex justify="space-between" align="start" mb={2}>
              <Box>
                <Text fontWeight="semibold" fontSize="lg">
                  {review.item}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Owner: {review.owner}
                </Text>
              </Box>
  
              <Flex align="center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    as={StarIcon}
                    key={i}
                    boxSize={4}
                    color={i < review.rating ? 'yellow.400' : 'gray.300'}
                  />
                ))}
              </Flex>
            </Flex>
  
            <Text color="gray.700" mb={2}>
              {review.comment}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Reviewed on {review.date}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  
    <Box px={6} py={4} bg="gray.50" borderTop="1px" borderColor="gray.200">
      <Button
        w="full"
        px={4}
        py={2}
        bg="blue.600"
        color="white"
        _hover={{ bg: 'blue.700' }}
        transition="background-color 0.2s"
      >
        Write a New Review
      </Button>
    </Box>
  </Box>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Renter Dashboard</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'dashboard' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('agreements')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'agreements' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Agreements
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'reviews' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'agreements' && renderAgreements()}
        {activeTab === 'reviews' && renderReviews()}
      </div>
    </div>
  )
}

// interface DashboardCardProps {
//   title: string
//   icon: React.ElementType
//   value: string
//   subtext: string
// }

const DashboardCard = ({ title, icon: Icon, value, subtext }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Icon size={20} className="text-gray-400" />
    </div>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm text-gray-500">{subtext}</p>
  </div>
)


