import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, Heading, Textarea, Select, useToast, IconButton, Image
} from "@chakra-ui/react";
import { useParams, useNavigate } from 'react-router-dom';
import { getOneUserListingAPI, Updatelistings } from '../../Api/ListingApi';
import { CloseIcon } from '@chakra-ui/icons';

const baseUrl = `${import.meta.env.VITE_BACK_END_URL}`;

export default function UpdateListing() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    priceUnit: '',
    amenities: [],
    rules: [],
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [removedVideos, setRemovedVideos] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await getOneUserListingAPI(id);
        const listing = response.data;
        console.log("listing", listing);
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          priceUnit: listing.priceUnit,
          amenities: listing.amenities || [],
          rules: listing.rules || [],
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
  }, [id, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previewUrls]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos([...videos, ...files]);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setVideoPreviews([...videoPreviews, ...previewUrls]);
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const removedImage = existingImages[index];
      setRemovedImages([...removedImages, removedImage]);
      setExistingImages(existingImages.filter((_, i) => i !== index));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    } else {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveVideo = (index, isExisting) => {
    if (isExisting) {
      const removedVideo = existingVideos[index];
      setRemovedVideos([...removedVideos, removedVideo]);
      setExistingVideos(existingVideos.filter((_, i) => i !== index));
      setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
    } else {
      const newVideos = [...videos];
      newVideos.splice(index, 1);
      setVideos(newVideos);
      const newPreviews = [...videoPreviews];
      newPreviews.splice(index, 1);
      setVideoPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append('title', formData.title);
    updateData.append('description', formData.description);
    updateData.append('price', formData.price);
    updateData.append('category', formData.category);
    updateData.append('priceUnit', formData.priceUnit);
    updateData.append('amenities', JSON.stringify(formData.amenities));
    updateData.append('rules', JSON.stringify(formData.rules));
    updateData.append('removedImages', JSON.stringify(removedImages));
    updateData.append('removedVideos', JSON.stringify(removedVideos));
    images.forEach((file) => updateData.append('images', file));
    videos.forEach((file) => updateData.append('videos', file));

    try {
      await Updatelistings(id, updateData);
      toast({
        title: "Listing updated",
        description: "The listing has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/listings/${id}`);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.error || "Could not update listing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading>Update Listing</Heading>
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

          {/* Images Section */}
          <FormControl>
            <FormLabel>Images</FormLabel>
            <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
              {imagePreviews.map((src, index) => (
                <Box key={index} position="relative">
                  <Image src={src} alt={`preview-${index}`} boxSize="80px" />
                  <IconButton icon={<CloseIcon />} size="xs" position="absolute" top={1} right={1} colorScheme="red" onClick={() => handleRemoveImage(index, index < existingImages.length)} />
                </Box>
              ))}
            </Box>
          </FormControl>

          {/* Videos Section */}
          <FormControl>
            <FormLabel>Videos</FormLabel>
            <Input type="file" multiple accept="video/*" onChange={handleVideoChange} />
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
              {videoPreviews.map((src, index) => (
                <Box key={index} position="relative">
                  <video src={src} width="80px" height="80px" controls />
                  <IconButton icon={<CloseIcon />} size="xs" position="absolute" top={1} right={1} colorScheme="red" onClick={() => handleRemoveVideo(index, index < existingVideos.length)} />
                </Box>
              ))}
            </Box>
          </FormControl>

          <Button type="submit" colorScheme="blue" mt={4}>Update Listing</Button>
        </Stack>
      </form>
    </Box>
  );
}
