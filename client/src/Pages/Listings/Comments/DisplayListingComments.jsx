import React, { useState, useEffect } from "react";
import { AddReply, getCommentswithReplies } from "../../../Api/commentsApi";
import { Box, HStack, VStack, Avatar, Button, Text, Textarea, useToast } from "@chakra-ui/react";
import { useAuth } from "../../../hooks/AuthContext";

export default function DisplayListingComments({ currentID }) {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const toast = useToast();

  const [replyingTo, setReplyingTo] = useState(null); // Tracks the comment being replied to
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentID) {
          const response = await getCommentswithReplies(currentID);
          setComments(response.data.comments);
          console.log(response.data.comments);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }
    fetchData();
  }, [currentID]);

  const handleReplySubmit = (parentId) => {
    if (replyContent.trim()) {
      const newReply = {
        author: user._id,
        text: replyContent,
        commentId:parentId,
        userDetail: {
          name: user.name,
          avatar: user.imageUrl,
        },
        createdAt: new Date().toISOString(),
      };
      console.log("replieees",newReply);

     const response =  AddReply(newReply);
     


      const updatedComments = comments.map((comment) => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyingTo(null);
      setReplyContent("");

      toast({
        title: "Reply added",
        description: "Your reply has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Box key={comment._id} borderWidth={1} borderRadius="md" p={4}>
            <HStack>
              <Avatar
                src={`${import.meta.env.VITE_BACK_END_URL}${comment.author.imageUrl}`}
                name={comment.author.name}
                size="sm"
              />
              <Text fontWeight="bold">{comment.author.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            <Text mt={2}>{comment.text}</Text>

            {comment.replies && comment.replies.length > 0 && (
              <Box mt={4} pl={4} borderLeft="1px solid lightgray">
                {comment.replies.map((reply, index) => (
                  <Box key={index} mt={2}>
                    <HStack>
                      <Avatar src={`${import.meta.env.VITE_BACK_END_URL}${reply.author.imageUrl}`} name={reply.author.name} size="xs" />
                      <Text fontWeight="bold">{reply.author.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <Text mt={1}>{reply.text}</Text>
                  </Box>
                ))}
              </Box>
            )}

            {replyingTo === comment._id ? (
              <Box mt={4}>
                <Textarea
                  bg="white"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                />
                <Button mt={2} colorScheme="teal" onClick={() => handleReplySubmit(comment._id)}>
                  Post Reply
                </Button>
                <Button mt={2} ml={2} onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button mt={4} size="sm" onClick={() => setReplyingTo(comment._id)}>
                Reply
              </Button>
            )}
          </Box>
        ))
      ) : (
        <Text>No comments available.</Text>
      )}
    </VStack>
  );
}
