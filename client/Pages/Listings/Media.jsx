import React, { useContext, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, useToast, Textarea } from "@chakra-ui/react";
import { uploadMediaAPI } from "../../src/Api/ListingApi";  // Adjust the path to your API utility file
import   {useAuth } from "../../src/hooks/AuthContext"
export default function Media() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [owner, setOwner] = useState('');
  const {user} = useAuth();
  
  // New state variables for other rental information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  // const [location, setLocation] = useState(''); // Location state removed as per your request
  const [amenities, setAmenities] = useState([]); // Initialize amenities as an array

  const toast = useToast();

  // Handle image selection
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    setVideos(e.target.files);
  };

  // Handle amenities input
  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    const amenitiesArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setAmenities(amenitiesArray); // Update amenities as an array
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        toast({
          title: "Not authenticated.",
          description: "Please log in to upload listing.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return; // Prevent form submission if user is not logged in
      }
console.log("USer",user);
    const formData = new FormData();
    formData.append('owner', user._id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('priceUnit', priceUnit);
    // formData.append('location', location); // Location removed from form data
    formData.append('amenities', JSON.stringify(amenities)); // Send amenities as a JSON string

    // Append each image
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    // Append each video
    if (videos.length > 0) {
      for (let i = 0; i < videos.length; i++) {
        formData.append('videos', videos[i]);
      }
    }

    try {
      const response = await uploadMediaAPI(formData);
      console.log('Response:', response.data);
      toast({
        title: "Media uploaded.",
        description: "Your media has been uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Clear the form after submission
      setOwner('');
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setPriceUnit('');
      // setLocation(''); // Reset location state removed
      setAmenities([]); // Clear amenities array
      setImages([]);
      setVideos([]);

    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload failed.",
        description: "There was an error uploading your media.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt="8"
      p="6"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
    >
      <Heading as="h2" size="lg" textAlign="center" mb="6" color="teal.500">
        Upload Media
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
            {/* {
                user && user.length > 0 &&  ( <FormControl isRequired>
                    <FormLabel>Owner</FormLabel>
                    <Input
                      type="text"
                      value={user._id}
                    />
                  </FormControl>
        )
            } */}
         
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter listing title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter listing description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter listing price"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter listing category"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price Unit</FormLabel>
            <Input
              type="text"
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              placeholder="Enter price unit (e.g., per night)"
            />
          </FormControl>

          {/* <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter listing location"
            />
          </FormControl> */}

          <FormControl>
            <FormLabel>Amenities (comma separated)</FormLabel>
            <Input
              type="text"
              value={amenities.join(', ')} // Display the amenities as a comma-separated string
              onChange={handleAmenitiesChange}
              placeholder="Enter amenities (comma separated)"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Images</FormLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              border="none"
              p="2"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Videos</FormLabel>
            <Input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              border="none"
              p="2"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" size="lg" width="full">
            Upload
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
