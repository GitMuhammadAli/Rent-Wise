import React, { useContext, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Image, Input, Stack, Text, Textarea, Switch } from "@chakra-ui/react";
// import { createListingAPI } from "../../src/Api/ListingApi"; 
import { ListingsContext } from "../../src/hooks/ListingsContext";

export default function CreateListingForm() {
  const { state, dispatch } = useContext(ListingsContext);
  const { listings } = state; 
  const [formData, setFormData] = useState({
    owner: "",
    title: "",
    description: "",
    price: 0,
    category: "car",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    amenities: [""],
    rules: [""],
    availability: [{ startDate: "", endDate: "" }],
    images: [{ url: "", caption: "" }],
    videos: [{ url: "", caption: "" }],
    priceUnit: "day",
    averageRating: 0,
    status: "pending",
    biddingEnabled: false, // New state for bidding
    minimumBid: 0, // Minimum bid amount
    bidIncrement: 0, // Bid increment
    bidEndDate: "", // Bidding end date
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAmenity = () => {
        setFormData((prevData) => ({
          ...prevData,
          amenities: [...prevData.amenities, ""],
        }));
      };
    
      const handleAddRule = () => {
        setFormData((prevData) => ({
          ...prevData,
          rules: [...prevData.rules, ""],
        }));
      };

    const handleAddImage = () => {
        setFormData((prevData) => ({
          ...prevData,
          images: [...prevData.images, { url: "", caption: "" }],
        }));
      };
      
      const handleImageChange = (index, key, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index][key] = value;
        setFormData((prevData) => ({
          ...prevData,
          images: updatedImages,
        }));
      };
      
      const handleAddVideo = () => {
        setFormData((prevData) => ({
          ...prevData,
          videos: [...prevData.videos, { url: "", caption: "" }],
        }));
      };
      
      const handleVideoChange = (index, key, value) => {
        const updatedVideos = [...formData.videos];
        updatedVideos[index][key] = value;
        setFormData((prevData) => ({
          ...prevData,
          videos: updatedVideos,
        }));
      };
      
  const handleNestedChange = (e, parent, key) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [key]: value,
      },
    }));
  };

  const handleBiddingToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      biddingEnabled: !prevData.biddingEnabled,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await createListingAPI(formData);
    //   dispatch({ type: 'ADD_LISTING', payload: response });
    //   console.log("Response is: ", response);
    // } catch (error) {
    //   console.error("Error creating listing:", error);
    //   alert("Failed to create listing. Please try again.");
    // }
  };

  return (
    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} py={'50px'}>
      <Flex gap={4} flexDir={'row'} borderRadius={'10px'} bg={'gray.900'} color={'white'} w={'90%'}>
        <Image alignSelf={'flex-end'} w={'auto'} h={'300px'} src="https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMjA3LTItMzMwXzEuanBn.jpg" />
        <Box alignSelf={'center'} py={'50px'}>
          <Heading textAlign={'left'} fontWeight="extrabold">Upload Your Property | Vehicle Details</Heading>
          <Text pt={4}>We're committed to providing a reliable marketplace for all your property and vehicle needs</Text>
        </Box>
        <Image alignSelf={'flex-end'} w={'auto'} h={'300px'} src="https://images.rawpixel.com/image_social_portrait/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvbnMyMDA0Ni1pbWFnZS1rd3Z5YTF1Yy5qcGc.jpg" />
      </Flex>
      
      <Box bg={'white'} w={'70%'} mx="auto" mt={8} py={10} px={20} borderWidth={1} borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Owner ID</FormLabel>
              <Input name="owner" value={formData.owner} onChange={handleChange} placeholder="Owner ID" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <Input name="price" value={formData.price} type="number" onChange={handleChange} placeholder="Price" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
            </FormControl>

            <FormControl>
              <FormLabel>Location Address</FormLabel>
              <Input name="location.address" value={formData.location.address} onChange={(e) => handleNestedChange(e, "location", "address")} placeholder="Address" />
            </FormControl>

            <FormControl>
              <FormLabel>City</FormLabel>
              <Input name="location.city" value={formData.location.city} onChange={(e) => handleNestedChange(e, "location", "city")} placeholder="City" />
            </FormControl>

            <FormControl>
              <FormLabel>State</FormLabel>
              <Input name="location.state" value={formData.location.state} onChange={(e) => handleNestedChange(e, "location", "state")} placeholder="State" />
            </FormControl>

            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input name="location.country" value={formData.location.country} onChange={(e) => handleNestedChange(e, "location", "country")} placeholder="Country" />
            </FormControl>

            <FormControl>
              <FormLabel>Zip Code</FormLabel>
              <Input name="location.zipCode" value={formData.location.zipCode} onChange={(e) => handleNestedChange(e, "location", "zipCode")} placeholder="Zip Code" />
            </FormControl>

            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <Input name="location.coordinates.latitude" value={formData.location.coordinates.latitude} onChange={(e) => handleNestedChange(e, "location.coordinates", "latitude")} placeholder="Latitude" />
            </FormControl>

            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <Input name="location.coordinates.longitude" value={formData.location.coordinates.longitude} onChange={(e) => handleNestedChange(e, "location.coordinates", "longitude")} placeholder="Longitude" />
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
        <Button onClick={() => setFormData({ ...formData, amenities: formData.amenities.filter((_, i) => i !== index) })}>Remove</Button>
      </Flex>
    ))}
    <Button onClick={handleAddAmenity}>Add Amenity</Button>
  </FormControl>

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
        <Button onClick={() => setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) })}>Remove</Button>
      </Flex>
    ))}
    <Button onClick={handleAddRule}>Add Rule</Button>
  </FormControl> 


{/* Images Section */}
<Stack spacing={4} mt={8}>
  <Heading size="md">Images</Heading>
  {formData.images.map((image, index) => (
    <Flex key={index} gap={2}>
      <FormControl>
        <FormLabel>Image URL</FormLabel>
        <Input
          value={image.url}
          onChange={(e) => handleImageChange(index, "url", e.target.value)}
          placeholder="Image URL"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Caption</FormLabel>
        <Input
          value={image.caption}
          onChange={(e) => handleImageChange(index, "caption", e.target.value)}
          placeholder="Caption (optional)"
        />
      </FormControl>
    </Flex>
  ))}
  <Button onClick={handleAddImage} colorScheme="teal">
    Add Another Image
  </Button>
</Stack>

{/* Videos Section */}
<Stack spacing={4} mt={8}>
  <Heading size="md">Videos</Heading>
  {formData.videos.map((video, index) => (
    <Flex key={index} gap={2}>
      <FormControl>
        <FormLabel>Video URL</FormLabel>
        <Input
          value={video.url}
          onChange={(e) => handleVideoChange(index, "url", e.target.value)}
          placeholder="Video URL"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Caption</FormLabel>
        <Input
          value={video.caption}
          onChange={(e) => handleVideoChange(index, "caption", e.target.value)}
          placeholder="Caption (optional)"
        />
      </FormControl>
    </Flex>
  ))}
  <Button onClick={handleAddVideo} colorScheme="teal">
    Add Another Video
  </Button>
</Stack>


  

            {/* Bidding Section */}
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

            <Button colorScheme="blue" type="submit" mt={4}>
              Create Listing
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}


