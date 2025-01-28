// import React, { useContext, useState } from "react";
// import { Box, Button, Flex, FormControl, FormLabel, Heading, Image, Input, Stack, Text, Textarea } from "@chakra-ui/react";
// import { useNavigate  } from "react-router-dom";

// // import { createListingAPI } from "../../src/Api/ListingApi"; 
// // import { ListingsContext } from "../../src/hooks/ListingsContext";

// export default function CreateListingForm() {
//   const navigate = useNavigate();
//   // const { state, dispatch } = useContext(ListingsContext);
//   // const { listings } = state; 
//   const [ error, setError] = useState('');
//   const defaultFormData = {
//     owner: "",
//     title: "",
//     description: "",
//     price: 0,
//     category: "car",
//     location: {
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       zipCode: "",
//       coordinates: {
//         latitude: 0,
//         longitude: 0,
//       },
//     },
//     amenities: [""],
//     rules: [""],
//     availability: [{ startDate: "", endDate: "" }],
//     priceUnit: "day",
//     averageRating: 0,
//     status: "pending",
//   };
//   const [formData, setFormData] = useState(defaultFormData);
    
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
  
//     if (name === 'amenities' || name === 'rules') {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value.split(',').map(item => item.trim()), // Split by commas and remove spaces
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };
  

//   const handleNestedChange = (e, parent, key) => {
//     const { value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [parent]: {
//         ...prevData[parent],
//         [key]: value,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try
//     {
//         const response = await createListingAPI(formData);
//         dispatch({type:'ADD_LISTING', payload: response})
//         console.log("Response is: ", response);
//       setFormData(defaultFormData)
  
//         setError('');
//     }
//     catch(error)
//     {
//       console.error("Error creating listing:", error);
//   setError("Error Creating Listings, check values again");
//     }
   
    
//   };

//   return (
//     <Flex  flexDir={'column'} justifyContent={'center'} alignItems={'center'} py={'50px'} >
//         {/* <Heading fontWeight="extrabold" >Make Your Listings</Heading> */}
//         <Flex gap={4} flexDir={'row'} borderRadius={'10px'} bg={'gray.900'} color={'white'}    w={'90%'}>
//             <Image alignSelf={'flex-end'} w={'auto'} h={'300px'}  src="https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjA3LTItMzMwXzEuanBn.jpg"/>
//             <Box alignSelf={'center'} py={'50px'} >
//             <Heading textAlign={'left'}  fontWeight="extrabold" >Upload Your Property | Vehichle Details</Heading>
//             <Text pt={4}>We're committed to providing a reliable marketplace for all your property and vehicle needs</Text>
//             </Box>
            
//             <Image alignSelf={'flex-end'} w={'auto'} h={'300px'} src="https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvbnMyMDA0Ni1pbWFnZS1rd3Z5YTF1Yy5qcGc.jpg"/>
//             </Flex>
//     <Box bg={'white'} w={'70%'} mx="auto"  mt={8} py={10} px={20} borderWidth={1} borderRadius="md">
//       <form onSubmit={handleSubmit}>
//         <Stack spacing={4}>
//           <FormControl isRequired>
//             <FormLabel>Owner ID</FormLabel>
//             <Input name="owner" value={formData.owner} onChange={handleChange} placeholder="Owner ID" />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel>Title</FormLabel>
//             <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel>Description</FormLabel>
//             <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel>Price</FormLabel>
//             <Input name="price" value={formData.price} type="number" onChange={handleChange} placeholder="Price" />
//           </FormControl>

//           <FormControl isRequired>
//             <FormLabel>Category</FormLabel>
//             <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Location Address</FormLabel>
//             <Input name="location.address" value={formData.location.address} onChange={(e) => handleNestedChange(e, "location", "address")} placeholder="Address" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>City</FormLabel>
//             <Input name="location.city" value={formData.location.city} onChange={(e) => handleNestedChange(e, "location", "city")} placeholder="City" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>State</FormLabel>
//             <Input name="location.state" value={formData.location.state} onChange={(e) => handleNestedChange(e, "location", "state")} placeholder="State" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Country</FormLabel>
//             <Input name="location.country" value={formData.location.country} onChange={(e) => handleNestedChange(e, "location", "country")} placeholder="Country" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Zip Code</FormLabel>
//             <Input name="location.zipCode" value={formData.location.zipCode} onChange={(e) => handleNestedChange(e, "location", "zipCode")} placeholder="Zip Code" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Latitude</FormLabel>
//             <Input name="location.coordinates.latitude" value={formData.location.coordinates.latitude} onChange={(e) => handleNestedChange(e, "location.coordinates", "latitude")} placeholder="Latitude" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Longitude</FormLabel>
//             <Input name="location.coordinates.longitude" value={formData.location.coordinates.longitude} onChange={(e) => handleNestedChange(e, "location.coordinates", "longitude")} placeholder="Longitude" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Amenities</FormLabel>
//             <Input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma-separated)" />
//           </FormControl>

//           <FormControl>
//             <FormLabel>Rules</FormLabel>
//             <Input name="rules" value={formData.rules} onChange={handleChange} placeholder="Rules (comma-separated)" />
//           </FormControl>
//           {
//             error && (
//               <Box bg={'#f3d2d2'} color={'#e7195a'} p={'10px'} w={'100%'} borderRadius={'5px'} >{error}</Box>
//             )
//           }

//           <Button colorScheme="blue" type="submit" mt={4}>
//             Create Listing
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//     </Flex>
//   );
// }
