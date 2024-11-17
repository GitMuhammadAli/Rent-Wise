 // id to be passed 

import React, {  useState } from 'react';
import { useAuth } from '../../../hooks/AuthContext';
import { AddComment } from '../../../Api/commentsApi';
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
  

const baseUrl = import.meta.env.VITE_BACK_END_URL;
export default function AddCommentsInListing({toast,id}) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useAuth();


   

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



     
  return (
    <div>

        <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Comments</Text>
       
            <Textarea
              bg={'white'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button mt={2} colorScheme="teal" onClick={handleCommentSubmit}>
              Post Comment
            </Button>
        </Box>

        
      
    </div>
  )
}
