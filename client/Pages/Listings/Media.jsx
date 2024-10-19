import React, { useContext, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, Heading, useToast, Textarea, Flex, Text, Image
} from "@chakra-ui/react";
import { uploadMediaAPI } from "../../src/Api/ListingApi";  // Adjust the path to your API utility file
import { useAuth } from "../../src/hooks/AuthContext";

export default function Media() {
  const [formData, setFormData] = useState({
    amenities: [""],  // Start with one empty amenity
    rules: [""],      // Start with one empty rule
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // For image previews
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();

  // New state variables for other rental information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [priceUnit, setPriceUnit] = useState('');

  const toast = useToast();

  // Handle image selection and generate previews
  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);

    // Create image previews
    const previewUrls = [];
    for (let i = 0; i < files.length; i++) {
      const imageUrl = URL.createObjectURL(files[i]);
      previewUrls.push(imageUrl);
    }
    setImagePreviews(previewUrls); // Set previews for rendering
  };

  // Handle video selection
  const handleVideoChange = (e) => {
    setVideos(e.target.files);
  };

  // Add new amenity field
  const handleAddAmenity = () => {
    setFormData((prevData) => ({
      ...prevData,
      amenities: [...prevData.amenities, ""],
    }));
  };

  // Add new rule field
  const handleAddRule = () => {
    setFormData((prevData) => ({
      ...prevData,
      rules: [...prevData.rules, ""],
    }));
  };

  // Handle amenity change
  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData((prevData) => ({ ...prevData, amenities: newAmenities }));
  };

  // Handle rule change
  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prevData) => ({ ...prevData, rules: newRules }));
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

    const formDataToSend = new FormData();
    formDataToSend.append('owner', user._id);
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    formDataToSend.append('price', price);
    formDataToSend.append('category', category);
    formDataToSend.append('priceUnit', priceUnit);
    formDataToSend.append('amenities', JSON.stringify(formData.amenities));
    formDataToSend.append('rules', JSON.stringify(formData.rules));

    // Append each image
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formDataToSend.append('images', images[i]);
      }
    }

    // Append each video
    if (videos.length > 0) {
      for (let i = 0; i < videos.length; i++) {
        formDataToSend.append('videos', videos[i]);
      }
    }

    try {
      const response = await uploadMediaAPI(formDataToSend);
      toast({
        title: "Media uploaded.",
        description: "Your media has been uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear the form after submission
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setPriceUnit('');
      setFormData({ amenities: [""], rules: [""] });
      setImages([]);
      setVideos([]);
      setImagePreviews([]); // Clear image previews after submission

    } catch (error) {
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
    <Flex py={'50px'} flexDir={'column'}>
      <form onSubmit={handleSubmit}>
        <Flex justifyContent={'center'} gap={10}>
          <Stack w="50vw" mt="8" p="6" bg="white" boxShadow="lg" borderRadius="md" spacing="4">
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

            {/* Amenities Section */}
            <FormControl>
              <FormLabel>Amenities</FormLabel>
              {formData.amenities.map((amenity, index) => (
                <Flex key={index} mb={2}>
                  <Input
                    value={amenity}
                    onChange={(e) => handleAmenityChange(index, e.target.value)}
                    placeholder={`Amenity ${index + 1}`}
                    mr={2}
                  />
                  <Button onClick={() =>
                    setFormData({
                      ...formData,
                      amenities: formData.amenities.filter((_, i) => i !== index),
                    })
                  }>
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button onClick={handleAddAmenity}>Add Amenity</Button>
            </FormControl>

            {/* Rules Section */}
            <FormControl>
              <FormLabel>Rules</FormLabel>
              {formData.rules.map((rule, index) => (
                <Flex key={index} mb={2}>
                  <Input
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    mr={2}
                  />
                  <Button onClick={() =>
                    setFormData({
                      ...formData,
                      rules: formData.rules.filter((_, i) => i !== index),
                    })
                  }>
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button onClick={handleAddRule}>Add Rule</Button>
            </FormControl>
          </Stack>

          <Stack w="30vw" mt="8" p="6" boxShadow="lg" borderRadius="md" bg={'white'}>
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

            {/* Preview of uploaded images */}
            <Box mt={4} display="flex" flexWrap="wrap" gap={4}>
              {imagePreviews.map((src, index) => (
                <Box key={index} boxSize="100px" overflow="hidden" borderRadius="md">
                  <Image src={src} alt={`preview ${index}`} objectFit="cover" />
                </Box>
              ))}
            </Box>

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

            <Button type="submit" colorScheme="teal" mt="4">
              Upload
            </Button>
          </Stack>
        </Flex>
      </form>
    </Flex>
  );
}
