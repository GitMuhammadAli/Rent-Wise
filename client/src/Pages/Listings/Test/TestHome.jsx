
// import { useContext, useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { Box, Flex, Heading, Text, Button, Container, Grid, GridItem,Input, Image } from "@chakra-ui/react";
// import { FaBuilding, FaCar, FaHotel, FaSearch, FaStar, FaArrowRight } from "react-icons/fa"
// import { getAllListingAPI } from "../../../Api/ListingApi"; 
// // import { staticListings, categories } from "./data"
// import AnimatedBackground from "./Animated"
// import { staticListings, categories } from "./staticData"
// import { ListingsContext } from "../../../hooks/ListingsContext";

// const TestHome = () => {

// //   my things

// const { state, dispatch } = useContext(ListingsContext); 
//   const { listings } = state; 
//   const itemsPerPage = 6 // Number of listings per page
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = Math.ceil(listings.length / itemsPerPage);

//     // Get the listings for the current page
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const curentListing = listings.slice(startIndex, endIndex);

//     const goToNextPage = () => {
//       if (currentPage < totalPages) {
//           setCurrentPage(currentPage + 1);
//       }
//   };

//   const goToPrevPage = () => {
//       if (currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//       }
//   };

  

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await getAllListingAPI();
//         console.log("Response is: ", response.data);
//         dispatch({ type: 'GET_LISTINGS', payload: response.data });
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     }
//     fetchData();
//   }, [dispatch]);

//   useEffect(()=>{
//     console.log("Current listings in get state in getAll:", listings)
//   },[listings])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
//        <Box position="relative" overflow="hidden" height="80vh">
//       <AnimatedBackground />
//       <Flex position="relative" zIndex={10} height="full" alignItems="center">
//         <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
//           <Flex direction="column" alignItems="center" textAlign="center">
//             <Heading
//               fontSize={{ base: "5xl", md: "7xl" }}
//               fontWeight="extrabold"
//               color="white"
//               mb={4}
//               className="animate-fade-in-up"
//             >
//               Welcome to <Text as="span" color="yellow.300">RentWise</Text>
//             </Heading>
//             <Text
//               mt={3}
//               maxW={{ base: "md", md: "3xl" }}
//               mx="auto"
//               fontSize={{ base: "xl", sm: "2xl" }}
//               color="white"
//               className="animate-fade-in-up animation-delay-300"
//             >
//               Discover premium rentals for homes, cars, and more. Your journey begins here.
//             </Text>
//             <Flex mt={10} justifyContent="center" className="animate-fade-in-up animation-delay-600">
//               <Box rounded="md" shadow="md">
//                 <Link href="#search" _hover={{ textDecoration: "none" }}>
//                   <Button
//                     px={{ base: 8, md: 10 }}
//                     py={{ base: 3, md: 7 }}
//                     fontSize={{ base: "md", md: "lg" }}
//                     fontWeight="medium"
//                     colorScheme="whiteAlpha"
//                     color="orange.700"
//                     bg="white"
//                     _hover={{ bg: "gray.50" }}
//                     transition="all 0.3s ease"
//                   >
//                     Get started
//                   </Button>
//                 </Link>
//               </Box>
//               <Box ml={3}>
//                 <Link href="#featured" _hover={{ textDecoration: "none" }}>
//                   <Button
//                     px={{ base: 8, md: 10 }}
//                     py={{ base: 3, md: 7 }}
//                     fontSize={{ base: "md", md: "lg" }}
//                     fontWeight="medium"
//                     colorScheme="orange"
//                     bg="orange.500"
//                     _hover={{ bg: "orange.700" }}
//                     transition="all 0.3s ease"
//                   >
//                     View listings
//                   </Button>
//                 </Link>
//               </Box>
//             </Flex>
//           </Flex>
//         </Container>
//       </Flex>
//     </Box>


//       {/* Search Section */}
//       <Box id="search" maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={16}>
//       <Box textAlign="center">
//         <Heading fontSize={{ base: "4xl", sm: "5xl" }} fontWeight="extrabold" color="gray.900">
//           Find Your Perfect Rental
//         </Heading>
//         <Text mt={4} fontSize="xl" color="gray.600">
//           Search through our extensive selection of premium rentals
//         </Text>
//       </Box>
//       <Flex mt={8} justifyContent="center">
//         <Input
//         bg={'white'}
//           type="text"
//           placeholder="What would you like to rent?"
//           w="60%"
//           rounded="md"
//           py={3}
//           px={4}
//           shadow="sm"
          
//           _focus={{ ringColor: "orange.500", borderColor: "orange.500",  boxShadow: "none" }}
//           color="orange.500"
//           fontSize="lg"
//         />
//         <Button  px={4} py={3} bg="orange.500" color="white" rounded="md" _hover={{ bg: "orange.600" }} transition="all 0.3s ease">
//           <FaSearch className="h-5 w-5" />
//         </Button>
//       </Flex>
//     </Box>

//       {/* Categories Section */}
//       {/* <div className="bg-white py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-extrabold text-gray-900 text-center">Explore Our Premium Categories</h2>
//           <div className="mt-20 grid gap-12 lg:grid-cols-3">
//             {categories.map((category) => (
//               <div key={category.name} className="bg-orange-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
//                 <div className="text-center">
//                   <category.icon className="text-orange-500 w-16 h-16 mx-auto" />
//                   <h3 className="text-2xl font-semibold mt-4">{category.name}</h3>
//                   <p className="text-gray-600 mt-2">{category.description}</p>
//                   <Link to={`/categories/${category.name.toLowerCase()}`} className="text-orange-600 hover:text-orange-800 mt-4 inline-flex items-center">
//                     Explore {category.name}
//                     <FaArrowRight className="ml-2" />
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div> */}
    

//       <Box bg="white" py={24}>
//         <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
//           <Heading fontSize={{ base: "4xl", sm: "5xl" }} fontWeight="extrabold" color="gray.900" textAlign="center">
//             Explore Our Premium Categories
//           </Heading>
//           <Grid mt={20} gap={12} templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}>
//             {categories.map((category) => (
//               <GridItem key={category.name} bg="orange.50"  p={14} rounded="xl" _hover={{ shadow: "2xl" }} transition="all 0.3s ease">
//                 <Box textAlign="center">
//                   <category.icon className="text-orange-500" style={{ width: "4rem", height: "4rem", margin: "0 auto" }} />
//                   <Heading fontSize="2xl" fontWeight="semibold" mt={4}>{category.name}</Heading>
//                   <Text color="gray.600" mt={2}>{category.description}</Text>
//                   <Flex fontWeight={'semibold'} as={Link} to={`/categories/${category.name.toLowerCase()}`} color="orange.400" _hover={{ color: "orange.700" }} mt={4} display="inline-flex" alignItems="center">
//                     <Text>Explore {category.name}</Text>
//                     <FaArrowRight style={{ marginLeft: "0.5rem" }} />
//                   </Flex>
//                 </Box>
//               </GridItem>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

      
//       {/* Featured Listings Section */}
// <Box id="featured" bg="gray.50" py={24}>
//         <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
//           <Heading fontSize={{ base: "4xl", sm: "5xl" }} fontWeight="extrabold" color="gray.900" textAlign="center">
//             Featured Premium Rentals
//           </Heading>
//           <Text my={4} fontSize={'18px'} color={'gray.600'} textAlign={'center'}>
//           Experience luxury with our top-tier rental selections
//           </Text>
//           <Grid mt={20} gap={12} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}>
//             {curentListing && curentListing?.length > 0 &&  curentListing.map((rental) => (
//               <GridItem key={rental._id} bg="white" rounded="lg" shadow="lg" overflow="hidden">
//                 {
//                    rental.images && rental.images.length > 0 ? (
//                     <Image src={`http://localhost:3600${rental?.images[0]?.url}`} alt={rental.title} w="full" h={64} objectFit="cover" />
//                    ) : (
//                     <Image src='images/make_listing/random.png'  alt={rental.title} w="full" h={64} objectFit="cover" />
//                    )
//                 }
//                 <Flex flexDir={'column'} gap={4} p={7}>
//                     <Flex justifyContent={'space-between'}> 
//                     <Heading fontSize="xl" fontWeight="semibold">{rental.title}</Heading>
//                     <Text fontSize={'lg'} fontWeight={'bold'}>{rental.price}PKR</Text>
//                     </Flex>
                 
//                   <Button alignSelf={'center'} w={'full'} bg={'orange.400'} _hover={{bg:'orange.500'}} as={Link}  to={`/rental/${rental._id}`} color="orange.50" fontWeight="medium">
//                     View Details
//                   </Button>
//                 </Flex>
//               </GridItem>
              
//             ))}
//           </Grid>
//             <Flex mt={10} alignItems={'center'}  justifyContent={'space-between'}>
//                        <Button bg={'orange.400'} _hover={{bg:'orange.500'}} color={'white'} onClick={goToPrevPage} isDisabled={currentPage === 1}>
//                        Previous
//                       </Button>
//                         <Text textAlign={'center'} >
//                           Page {currentPage} of {totalPages}
//                         </Text>
//                       <Button bg={'orange.400'} _hover={{bg:'orange.500'}}  color={'white'} onClick={goToNextPage} isDisabled={currentPage === totalPages}>
//                       Next
//                       </Button>
//                    </Flex>
//         </Container>
//       </Box>

//       {/* Call to Action */}
      
//       {/* <div className="bg-gradient-to-r from-orange-600 to-orange-400">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
//           <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Ready to Experience Premium Rentals?</h2>
//           <p className="mt-6 text-xl text-orange-100 max-w-3xl mx-auto">
//             Join RentWise today and unlock access to our exclusive selection of high-end rentals. Start your journey
//             towards unparalleled luxury and convenience.
//           </p>
//           <Link
//             to="/signup"
//             className="mt-12 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition duration-300"
//           >
//             Sign Up for Exclusive Access
//           </Link>
//         </div>
//         </div> */}
//         <Box bgGradient="linear(to-r, orange.500, orange.300)">
//         <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 16, sm: 24 }} textAlign="center">
//           <Heading fontSize={{ base: "4xl", sm: "5xl" }} fontWeight="extrabold" color="white">
//             Ready to Experience Premium Rentals?
//           </Heading>
//           <Text mt={6} fontSize="xl" color="orange.50" maxW="3xl" mx="auto">
//             Join RentWise today and unlock access to our exclusive selection of high-end rentals. Start your journey
//             towards unparalleled luxury and convenience.
//           </Text>
//           <Button
//           as={Link}
//             to="/signup"
//             mt={12}
//             display="inline-flex"
//             alignItems="center"
//             justifyContent="center"
//             px={8}
//             py={7}
//             border="1px solid transparent"
//             fontSize="lg"
//             fontWeight="medium"
//             rounded="md"
//             color="orange.500"
//             bg="white"
//             _hover={{ bg: "orange.50" }}
//             transition="all 0.3s ease"
//           >
//             Sign Up for Exclusive Access
//           </Button>
//         </Container>
//       </Box>

//       <style jsx>{`
//         @keyframes slide {
//           0% { opacity: 0; transform: scale(1.1); }
//           25% { opacity: 1; }
//           50% { opacity: 0; transform: scale(1); }
//           100% { opacity: 0; transform: scale(1.1); }
//         }
//         .animate-slide {
//           animation: slide 20s infinite;
//         }
//         .animate-slide-delayed {
//           animation: slide 20s infinite;
//           animation-delay: 10s;
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 1s ease-out forwards;
//         }
//         .animation-delay-300 {
//           animation-delay: 300ms;
//         }
//         .animation-delay-600 {
//           animation-delay: 600ms;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default TestHome

