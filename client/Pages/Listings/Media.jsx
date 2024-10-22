import React, { useContext, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, Heading, useToast, Textarea, Flex, Text, Image,
  Switch} from "@chakra-ui/react";
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
  const [biddingEnabled, setBiddingEnabled] = useState(false)
 const [minimumBid, setMinimumBid] = useState(0) // Minimum bid amount
 const  [bidIncrement,setBidIncre]= useState(0) // Bid increment
 const [bidEndDate,setBidEndDate] = useState('') // Bidding end date
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

  const handleBiddingToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      biddingEnabled: !prevData.biddingEnabled,
    }));
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
    formDataToSend.append('minimumBid', minimumBid);
    formDataToSend.append('bidIncrement', bidIncrement);
    formDataToSend.append('bidEndDate', bidEndDate);


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
console.log("responseIIIS",response )
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
      setMinimumBid(0);
      setBidIncre(0)
      setBidEndDate('');

    } catch (error) {
      toast({
        title: "Upload failed.",
        description: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("EEErrros is",error.response.data.error)
    }
  };

  return (
    <Flex py={'50px'} flexDir={'column'}>
    <Flex gap={4} alignSelf={'center'} alignItems={'center'} flexDir={'row'} borderRadius={'10px'} bg={'gray.900'} color={'white'}    w={'90%'}>
             <Image alignSelf={'flex-end'} w={'auto'} h={'300px'}  src="https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjA3LTItMzMwXzEuanBn.jpg"/>
             <Box alignSelf={'center'} py={'50px'} >
            <Heading textAlign={'left'}  fontWeight="extrabold" >Upload Your Property | Vehichle Details</Heading>
            <Text pt={4}>We're committed to providing a reliable marketplace for all your property and vehicle needs</Text>
             </Box>
            
             <Image alignSelf={'flex-end'} w={'auto'} h={'300px'} src="https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvbnMyMDA0Ni1pbWFnZS1rd3Z5YTF1Yy5qcGc.jpg"/>
            </Flex>
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
              <FormLabel>Category</FormLabel>
              <Select placeholder='Select category'
                onChange={(e) => setCategory(e.target.value)}
                value={category} >
                 <option value='car'>Car</option>
                 <option value='apartment'>Apartment</option>
                 <option value='hostel'>Hostel</option>
                 <option value='house'>House</option>
                </Select>
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
            {
              category && category != 'car' && ( 

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

              )
            }
            

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


            <Heading size="md">Bidding</Heading>
              <Flex alignItems="center" mt={2}>
                <Switch 
                  id="bidding" 
                  isChecked={biddingEnabled}
                  onChange={handleBiddingToggle}
                />
                <FormLabel htmlFor="bidding" ml={2}>Enable Bidding</FormLabel>
              </Flex>


{
  biddingEnabled ? (
    <Box className="mb-8" borderWidth={1} borderRadius="md" p={4}>
    <Stack spacing={4} mt={4}>
      <FormControl>
        <FormLabel htmlFor="minimumBid">Minimum Bid Amount</FormLabel>
        <Input 
          id="minimumBid" 
          type="number" 
          value={minimumBid} 
          onChange={(e) => setMinimumBid(e.target.value)} 
          placeholder="Enter minimum bid amount" 
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="bidIncrement">Bid Increment</FormLabel>
        <Input 
          id="bidIncrement" 
          type="number" 
          value={bidIncrement} 
          onChange={(e) => setBidIncre(e.target.value)} 
          placeholder="Enter bid increment" 
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="bidEndDate">Bidding End Date</FormLabel>
        <Input 
          id="bidEndDate" 
          type="date" 
          value={bidEndDate} 
          onChange={(e) => setBidEndDate(e.target.value)} 
        />
      </FormControl>
    </Stack>
  
</Box>
  ) : 
  
  (
    <FormControl isRequired>
    <FormLabel>Price</FormLabel>
    <Input
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      placeholder="Enter listing price"
    />
  </FormControl>
  )
}
           


           



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



            <Box className="mb-8" borderWidth={1} borderRadius="md" p={4}>
              <Heading size="md">Bidding</Heading>
              <Flex alignItems="center" mt={2}>
                <Switch 
                  id="bidding" 
                  isChecked={formData.biddingEnabled}
                  onChange={handleBiddingToggle}
                />
                <FormLabel htmlFor="bidding" ml={2}>Enable Bidding</FormLabel>
              </Flex>
              {formData.biddingEnabled && (
                <Stack spacing={4} mt={4}>
                  <FormControl>
                    <FormLabel htmlFor="minimumBid">Minimum Bid Amount</FormLabel>
                    <Input 
                      id="minimumBid" 
                      type="number" 
                      value={formData.minimumBid} 
                      onChange={(e) => setFormData({ ...formData, minimumBid: e.target.value })} 
                      placeholder="Enter minimum bid amount" 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bidIncrement">Bid Increment</FormLabel>
                    <Input 
                      id="bidIncrement" 
                      type="number" 
                      value={formData.bidIncrement} 
                      onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })} 
                      placeholder="Enter bid increment" 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bidEndDate">Bidding End Date</FormLabel>
                    <Input 
                      id="bidEndDate" 
                      type="date" 
                      value={formData.bidEndDate} 
                      onChange={(e) => setFormData({ ...formData, bidEndDate: e.target.value })} 
                    />
                  </FormControl>
                </Stack>
              )}
            </Box>

          </Stack>
          
        </Flex>
      </form>
    </Flex>
  );
}
