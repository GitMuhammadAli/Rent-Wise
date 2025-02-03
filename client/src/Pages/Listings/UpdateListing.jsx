import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from "../../hooks/AuthContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Textarea,
  Select,
  useToast,
  Flex,
  Image,
  Text,
  HStack
} from "@chakra-ui/react";
import { useParams, useNavigate } from 'react-router-dom';
import { getOneUserListingAPI, Updatelistings } from '../../Api/ListingApi';
import { ListingsContext } from '../../hooks/ListingsContext';

const baseUrl = `${import.meta.env.VITE_BACK_END_URL}`;
export default function UpdateListing() {
  const { id } = useParams();
const { user } = useAuth();
const {state,dispatch } = useContext(ListingsContext); 
const { listings,currentListing } = state; 


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    priceUnit: '',
    amenities: [],
    rules: [],
    listingStatus: 'active',
    bedrooms: 0,
    bathrooms: 0,
  });

  // Media states
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedVideos, setRemovedVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

 

  useEffect(() => {
    async function fetchListing() {
      try {
     
        const response = await getOneUserListingAPI(id);
        const listing = response.data;


        console.log("response updation", response.data);
        dispatch({ type: "GET_ONE_LISTING", payload: listing });
      
       
          
        console.log("useeffect fetch lists", currentListing)

        
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          priceUnit: listing.priceUnit,
          amenities: listing.amenities || [],
          rules: listing.rules || [],
          listingStatus: listing.listingStatus,
          bedrooms: listing.facilities?.bedrooms ?? 0,
          bathrooms: listing.facilities?.bathrooms ?? 0
        });

        setExistingImages(listing.images || []);
        setExistingVideos(listing.videos || []);
        setImagePreviews(listing.images.map(img => `${baseUrl}${img.url}`));
        setVideoPreviews(listing.videos.map(vid => `${baseUrl}${vid.url}`));

       

       
      } catch (error) {
        toast({
          title: "Error loading listing",
          description: error.response?.data?.error || "Could not fetch listing data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        
      }
    }
    fetchListing();
  }, [id, toast,dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previewUrls]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewVideos(prev => [...prev, ...files]);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setVideoPreviews(prev => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const imageToRemove = existingImages[index];
      setRemovedImages(prev => [...prev, imageToRemove]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index + existingImages.length));
    }
  };

  const handleRemoveVideo = (index, isExisting = false) => {
    if (isExisting) {
      const videoToRemove = existingVideos[index];
      setRemovedVideos(prev => [...prev, videoToRemove]);
      setExistingVideos(prev => prev.filter((_, i) => i !== index));
      setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewVideos(prev => prev.filter((_, i) => i !== index));
      setVideoPreviews(prev => prev.filter((_, i) => i !== index + existingVideos.length));
    }
  };

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
        return;
      }
       
      // new one
      const updatedFormData = {
        ...formData,
        bedrooms: formData.category === "house" || formData.category === "hostel" ? (formData.bedrooms ?? 0) : 0,
        bathrooms: formData.category === "house" || formData.category === "hostel" ? (formData.bathrooms ?? 0) : 0,
      };
      
      // till here

    const updateData = new FormData();

    // Append basic form data

    // Object.keys(formData).forEach(key => {
    //   if (Array.isArray(formData[key])) {
    //     updateData.append(key, JSON.stringify(formData[key]));
    //   } else {
    //     updateData.append(key, formData[key]);
    //   }
    // });

    Object.keys(updatedFormData).forEach((key) => {
      const value = updatedFormData[key];
    
      if (Array.isArray(value)) {
        updateData.append(key, JSON.stringify(value)); // Convert arrays to JSON
      } else {
        updateData.append(key, value);
      }
    });

    for (let [key, value] of updateData.entries()) {
      console.log(`values:::${key}: ${value}`);
    }
    
    // updateData.append('listingStatus', formData.listingStatus);
    updateData.append('owner', user._id);
    // Append media files and data
    newImages.forEach(image => updateData.append('images', image));
    newVideos.forEach(video => updateData.append('videos', video));
    updateData.append('existingImages', JSON.stringify(existingImages));
    updateData.append('existingVideos', JSON.stringify(existingVideos));
    updateData.append('removedImages', JSON.stringify(removedImages));
    updateData.append('removedVideos', JSON.stringify(removedVideos));

    try {
       console.log("updated status", updateData)
      const response =  await Updatelistings(id, updateData);
     dispatch({type:'UPDATE_LISTING', payload:response.data})
     console.log("res up", response.data)
     console.log("Listingggs are",listings)
      

      toast({
        title: "Listing updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    
      navigate(`/listings/${id}`);
    } catch (error) {
     
      toast({
        title: "Update failed",
        description: error.response?.data?.error || "Failed to update listing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log('errrrrrr', error.response.data.details);
      console.log('errrrrrrHA', error);
      
      
    }
  };

  const changeListingStatus=()=>{
    setFormData((prevData) => ({
      ...prevData,
      listingStatus: prevData.listingStatus === 'pending' ? 'active' : 'pending',
    }));
   
  }
  useEffect(()=>{
    console.log("listing status: ", formData.listingStatus)


  },[formData.listingStatus])

  return (
    <Box p={6} bg={'white'} borderRadius={'10px'}>
     
      <Heading mb={6}>Update Listing</Heading>
      
         


      {
        currentListing && <Box>
          {
            <Text>{currentListing.title}</Text>
          }
        </Box>
      }

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" value={formData.title} onChange={handleInputChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={formData.description} onChange={handleInputChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input name="price" type="number" value={formData.price} onChange={handleInputChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="car">Car</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price Unit</FormLabel>
            <Select name="priceUnit" value={formData.priceUnit} onChange={handleInputChange}>
              <option value="hour">Per Hour</option>
              <option value="day">Per Day</option>
              <option value="week">Per Week</option>
              <option value="month">Per Month</option>
            </Select>
          </FormControl>



          {formData.category && formData.category !== 'car' && (

            <>
                           <FormControl isRequired>
                              <FormLabel FormLabel>Bedrooms</FormLabel>
                                <HStack maxW="200px">
                                  <Button onClick={() => setFormData((prev) => ({ ...prev, bedrooms: Math.max(prev.bedrooms - 1, 0) }))}>-</Button>
                                    <Text>{formData.bedrooms}</Text>
                                  <Button onClick={() => setFormData((prev) => ({ ...prev, bedrooms: prev.bedrooms + 1 }))}>+</Button>
                                </HStack>
                            </FormControl>
            
                            <FormControl isRequired mt={4}>
                              <FormLabel>Bathrooms</FormLabel>
                                <HStack maxW="200px">
                                  <Button onClick={() => setFormData((prev) => ({ ...prev, bathrooms: Math.max(prev.bathrooms - 1, 0) }))}>-</Button>
                                  <Text>{formData.bathrooms}</Text>
                                  <Button onClick={() => setFormData((prev) => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}>+</Button>
                                </HStack>
                              </FormControl>

                <FormControl>

              <FormLabel>Amenities</FormLabel>
              {formData.amenities.map((amenity, index) => (
                <Flex key={index} mb={2}>
                  <Input
                    value={amenity}
                    onChange={(e) => {
                      const newAmenities = [...formData.amenities];
                      newAmenities[index] = e.target.value;
                      setFormData({ ...formData, amenities: newAmenities });
                    }}
                    placeholder={`Amenity ${index + 1}`}
                    mr={2}
                  />
                  <Button onClick={() => {
                    const newAmenities = formData.amenities.filter((_, i) => i !== index);
                    setFormData({ ...formData, amenities: newAmenities });
                  }}>Remove</Button>
                </Flex>
              ))}
              <Button onClick={() => setFormData({ 
                ...formData, 
                amenities: [...formData.amenities, ''] 
              })}>Add Amenity</Button>
            </FormControl>
            
            </>
        
          )}

          <FormControl>
            <FormLabel>Rules</FormLabel>
            {formData.rules.map((rule, index) => (
              <Flex key={index} mb={2}>
                <Input
                  value={rule}
                  onChange={(e) => {
                    const newRules = [...formData.rules];
                    newRules[index] = e.target.value;
                    setFormData({ ...formData, rules: newRules });
                  }}
                  placeholder={`Rule ${index + 1}`}
                  mr={2}
                />
                <Button onClick={() => {
                  const newRules = formData.rules.filter((_, i) => i !== index);
                  setFormData({ ...formData, rules: newRules });
                }}>Remove</Button>
              </Flex>
            ))}
            <Button onClick={() => setFormData({ 
              ...formData, 
              rules: [...formData.rules, ''] 
            })}>Add Rule</Button>
          </FormControl>

          {/* Media Sections */}
          <FormControl>
            <FormLabel>Images</FormLabel>
            <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <Flex wrap="wrap" gap={4} mt={4}>
              {existingImages.map((image, index) => (
                <Box key={`existing-image-${index}`} position="relative">
                  <Image 
                    src={`${baseUrl}${image.url}`} 
                    alt={`Existing ${index}`} 
                    boxSize="150px" 
                    objectFit="cover"
                  />
                  <Button
                    position="absolute"
                    top={1}
                    right={1}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveImage(index, true)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              
              {newImages.map((_, index) => (
                <Box key={`new-image-${index}`} position="relative">
                  <Image 
                    src={imagePreviews[index + existingImages.length]} 
                    alt={`New ${index}`} 
                    boxSize="150px" 
                    objectFit="cover"
                  />
                  <Button
                    position="absolute"
                    top={1}
                    right={1}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>Videos</FormLabel>
            <Input type="file" accept="video/*" multiple onChange={handleVideoChange} />
            <Flex wrap="wrap" gap={4} mt={4}>
              {existingVideos.map((video, index) => (
                <Box key={`existing-video-${index}`} position="relative">
                  <video width="150" controls>
                    <source src={`${baseUrl}${video.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    position="absolute"
                    top={1}
                    right={1}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveVideo(index, true)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              
              {newVideos.map((_, index) => (
                <Box key={`new-video-${index}`} position="relative">
                  <video width="150" controls>
                    <source src={videoPreviews[index + existingVideos.length]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    position="absolute"
                    top={1}
                    right={1}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveVideo(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Flex>
          </FormControl>
          <Heading  fontSize={"24px"}>Listing Status:</Heading>
          {
            formData.listingStatus === 'active' ? (<Text w={'fit-content'}   p={'5px'}
              borderRadius={'5px'} color={'white'} bg={'green.400'}>{formData.listingStatus}</Text>) :
             (<Text w={'fit-content'}
               bg={'blue.700'} 
               color={'white'}
               p={'5px'}
               borderRadius={'5px'}
               >{formData.listingStatus}</Text>)
          }
          
         <Flex justifyContent={'space-between'}>
          <Button onClick={changeListingStatus} alignSelf={'flex-end'} w={'fit-content'} colorScheme={formData.listingStatus ==='pending'? "teal": "blue"} size="md">
            Set listing status to {
              formData.listingStatus === 'active' ? ( 'Inactive') : ('Active')
            }
          </Button>
          <Button alignSelf={'flex-end'} w={'fit-content'} type="submit" colorScheme="teal" size="md">
            Update Listing
          </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
}
