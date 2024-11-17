import React, { useState, useEffect } from "react";
import { AddReply, getCommentswithReplies } from "../../../Api/commentsApi";
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Button,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../hooks/AuthContext";

export default function DisplayListingComments({ currentID }) {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const toast = useToast();

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContents, setReplyContents] = useState({});
  const [taggedUser, setTaggedUser] = useState(null);

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

  const handleReplySubmit = async (
    parentId,
    parentType = "comment",
    replyToId = null
  ) => {
    const replyKey = `${parentId}-${replyToId || "null"}`;
    const replyContent = replyContents[replyKey];

    if (replyContent && replyContent.trim()) {
      const newReply = {
        commentId: parentType === "comment" ? parentId : replyToId,
        parentReplyId: parentType === "reply" ? parentId : null,
        author: user._id,
        text: replyContent,
        taggedUser: taggedUser,
      };

      try {
        const response = await AddReply(newReply);
        const addedReply = response.data.reply;

        const updatedComments = comments.map((comment) => {
          if (comment._id === newReply.commentId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  ...addedReply,
                  author: { name: user.name, imageUrl: user.imageUrl },
                },
              ],
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyingTo(null);
        setReplyContents((prev) => ({ ...prev, [replyKey]: "" }));
        setTaggedUser(null);

        toast({
          title: "Reply added",
          description: "Your reply has been successfully added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add reply.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const RenderReply = ({ reply, parentCommentId }) => {
    const replyKey = `${parentCommentId}-${reply._id}`;

    return (
      <Box ml={4} borderLeft="1px solid lightgray" pl={4} mt={2}>
        <HStack>
          <Avatar
            src={`${import.meta.env.VITE_BACK_END_URL}${reply.author.imageUrl}`}
            name={reply.author.name}
            size="xs"
          />
          <Text fontWeight="bold">{reply.author.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(reply.createdAt).toLocaleDateString()}
          </Text>
        </HStack>
        <Text mt={1}>{reply.text}</Text>

        {replyingTo === reply._id ? (
          <Box mt={2}>
            <Textarea
              bg="white"
              value={replyContents[replyKey] || ""}
              onChange={(e) =>
                setReplyContents((prev) => ({
                  ...prev,
                  [replyKey]: e.target.value,
                }))
              }
              placeholder="Write a reply..."
              rows={3}
              resize="vertical"
            />
            <Button
              mt={2}
              colorScheme="teal"
              onClick={() => {
                setTaggedUser(reply.author._id);
                handleReplySubmit(reply._id, "reply", parentCommentId);
              }}
            >
              Post Reply
            </Button>
            <Button
              mt={2}
              ml={2}
              onClick={() => {
                setReplyingTo(null);
                setReplyContents((prev) => ({ ...prev, [replyKey]: "" }));
                setTaggedUser(null);
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button
            size="sm"
            mt={2}
            onClick={() => {
              setReplyingTo(reply._id);
              setTaggedUser(reply.author._id);
            }}
          >
            Reply
          </Button>
        )}

        {reply.replies &&
          reply.replies
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((nestedReply, index) => (
              <RenderReply
                key={nestedReply._id}
                reply={nestedReply}
                parentCommentId={parentCommentId}
              />
            ))}
      </Box>
    );
  };

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
              />
              <Text fontWeight="bold">{comment.author.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            <Text mt={2}>{comment.text}</Text>

            {replyingTo === comment._id ? (
              <Box mt={4}>
                <Textarea
                  bg="white"
                  value={replyContents[comment._id] || ""}
                  onChange={(e) =>
                    setReplyContents((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  rows={3}
                  resize="vertical"
                />
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() => {
                    setTaggedUser(comment.author._id);
                    handleReplySubmit(comment._id, "comment");
                  }}
                >
                  Post Reply
                </Button>
                <Button
                  mt={2}
                  ml={2}
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContents((prev) => ({
                      ...prev,
                      [comment._id]: "",
                    }));
                    setTaggedUser(null);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                mt={4}
                size="sm"
                onClick={() => {
                  setReplyingTo(comment._id);
                  setTaggedUser(comment.author._id);
                }}
              >
                Reply
              </Button>
            )}

            {comment.replies &&
              comment.replies
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((reply) => (
                  <RenderReply
                    key={reply._id}
                    reply={reply}
                    parentCommentId={comment._id}
                  />
                ))}
          </Box>
        ))
      ) : (
        <Text>No comments available.</Text>
      )}
    </VStack>
  );
}
