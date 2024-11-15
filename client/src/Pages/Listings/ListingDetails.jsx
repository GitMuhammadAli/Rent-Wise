import React, { useContext, useEffect, useState } from 'react';
import { ListingsContext } from '../../hooks/ListingsContext';
import { getOneUserListingAPI } from "../../Api/ListingApi";
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Image, 
  IconButton, 
  Spinner, 
  Flex, 
  Divider, 
  VStack,
  Text,
  Avatar,
  Button,
  Textarea,
  HStack,
  useToast
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/AuthContext';
import { AddComment } from '../../Api/commentsApi';
import ListingComments from './Comments/ListingComments';

const baseUrl = import.meta.env.VITE_BACK_END_URL;

const ListingDetails = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(ListingsContext);
  const { currentListing } = state;
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await getOneUserListingAPI(id);
        dispatch({ type: 'GET_ONE_LISTING', payload: response.data });
        // Sample comments for demonstration
        setComments([
          {
            id: '1',
            userDetail: { name: 'John Doe', avatar: 'https://bit.ly/dan-abramov' },
            content: 'Great place! Loved the amenities.',
            createdAt: '2023-06-15T10:00:00Z',
            replies: [
              {
                id: '2',
                userDetail: { name: 'Host', avatar: 'https://bit.ly/kent-c-dodds' },
                content: 'Thank you, John! We\'re glad you enjoyed your stay.',
                createdAt: '2023-06-15T11:30:00Z',
              }
            ]
          }
        ]);
      } catch (error) {
        console.error('Error fetching rental details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [id, dispatch]);

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.images.length
        : (prevIndex - 1 + currentListing.images.length) % currentListing.images.length
    ));
  };

  const handleVideoNavigation = (direction) => {
    setCurrentVideoIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % currentListing.videos.length
        : (prevIndex - 1 + currentListing.videos.length) % currentListing.videos.length
    ));
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      const commentData = {
        rental: id, // Pass the rental ID
        author: user._id, // Pass the current user ID
        text: newComment,
      };

      try {
        const response = await AddComment(commentData); // Call API to save the comment
        const savedComment = response.data;

        // Update state with the new comment
        setComments([
          {
            ...savedComment,
            userDetail: {
              name: user.name,
              avatar: `${import.meta.env.VITE_BACK_END_URL}${user.imageUrl}`,
            },
          },
          ...comments,
        ]);
        setNewComment('');

        toast({
          title: "Comment added",
          description: "Your comment has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error submitting comment', error);
        toast({
          title: "Error",
          description: "There was an issue adding your comment.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleReplySubmit = (parentId) => {
    if (replyContent.trim()) {
      const newReply = {
        id: Date.now().toString(),
        userDetail: {
          name: 'Current User',
          avatar: 'https://bit.ly/ryan-florence',
        },
        content: replyContent,
        createdAt: new Date().toISOString(),
      };
      const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyingTo(null);
      setReplyContent('');
      toast({
        title: "Reply added",
        description: "Your reply has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Text fontSize="2xl" fontWeight="bold">{currentListing.title}</Text>
        <Text fontSize="xl">Price: ${currentListing.price}</Text>
      </Box>

      {currentListing.images && (
        <Box position="relative" width="600px" height="400px" mx="auto">
          <Image
            src={`${baseUrl}${currentListing.images[currentImageIndex].url}`}
            alt={currentListing.images[currentImageIndex].caption || 'Image'}
            boxSize="full"
            objectFit="cover"
          />
          <IconButton
            icon={<ChevronLeftIcon />}
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            onClick={() => handleImageNavigation('prev')}
            zIndex="1"
            colorScheme="teal"
            aria-label="Previous Image"
          />
          <IconButton
            icon={<ChevronRightIcon />}
            position="absolute"
            top="50%"
            right="0"
            transform="translateY(-50%)"
            onClick={() => handleImageNavigation('next')}
            zIndex="1"
            colorScheme="teal"
            aria-label="Next Image"
          />
        </Box>
      )}

      <Divider />

      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Comments</Text>
        <VStack spacing={4} align="stretch">
          <Box>
            <Textarea
              bg={'white'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button mt={2} colorScheme="teal" onClick={handleCommentSubmit}>
              Post Comment
            </Button>

            <ListingComments currentID={currentListing._id}/>
          </Box>

          {comments.map((comment,index) => (
            <Box key={comment.id || index} borderWidth={1} borderRadius="md" p={4}>
              <HStack>
                <Avatar src={comment.userDetail.avatar} name={comment.userDetail.name} size="sm" />
                <Text fontWeight="bold">{comment.userDetail.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
              </HStack>
              <Text mt={2}>{comment.content}</Text>
              {replyingTo === comment.id ? (
                <Box mt={2}>
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <Button mt={2} size="sm" colorScheme="teal" onClick={() => handleReplySubmit(comment.id)}>
                    Post Reply
                  </Button>
                  <Button mt={2} ml={2} size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button bg={'blue.300'} color={'white'} _hover={{color:'black', bg:'white',border:'1px solid black'}} mt={2} size="sm" variant="outline" onClick={() => setReplyingTo(comment.id)}>
                  Reply
                </Button>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default ListingDetails;
