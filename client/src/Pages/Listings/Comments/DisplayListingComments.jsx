import React, { useState, useEffect } from "react";
import { getCommentswithReplies } from "../../../Api/commentsApi";
import { Box, HStack, VStack, Avatar, Text } from "@chakra-ui/react";

export default function DisplayListingComments({ currentID }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (currentID) {
          const response = await getCommentswithReplies(currentID);
          console.log("comments are: ", response.data);
          setComments(response.data.comments);
          console.log("curr idd", currentID);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }

    fetchData();
  }, [currentID]);

  return (
    <VStack spacing={4} align="stretch">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Box key={comment._id} borderWidth={1} borderRadius="md" p={4}>
            <HStack>
              <Avatar
                src={`${import.meta.env.VITE_BACK_END_URL}${
                  comment.author.imageUrl
                }`}
                name={comment.author.name}
                size="sm"
              />{" "}
              <Text fontWeight="bold">{comment.author.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            <Text mt={2}>{comment.text}</Text>
            {comment.replies?.length > 0 && (
              <VStack spacing={2} mt={4} pl={4} align="stretch">
                {comment.replies.map((reply) => (
                  <Box key={reply._id} borderLeftWidth={1} pl={2}>
                    <HStack>
                      <Avatar
                        src={`${import.meta.env.VITE_BACK_END_URL}${reply.author?.imageUrl}`}                        name={reply.author?.name}
                        size="xs"
                      />
                      <Text fontWeight="bold">{reply.author?.name}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <Text mt={1}>{reply.text}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        ))
      ) : (
        <Text>No comments available.</Text>
      )}
    </VStack>
  );
}
