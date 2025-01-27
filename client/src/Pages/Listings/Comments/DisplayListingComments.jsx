import React, { useState, useEffect } from "react";
import { AddReply, getCommentswithReplies, deleteComment, deleteReply } from "../../../Api/commentsApi";
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Button,
  Text,
  Textarea,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../../../hooks/AuthContext";

export default function DisplayListingComments({ currentID }) {
  const [comments, setComments] = useState([]);
  // const [replyingTo, setReplyingTo] = useState(null);
  // const [replyContents, setReplyContents] = useState({});
  const [cursorPosition, setCursorPosition] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    async function fetchComments() {
      try {
        if (currentID) {
          const response = await getCommentswithReplies(currentID);
          setComments(response.data.comments || []);
          console.log("comment", response)
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch comments.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    fetchComments();
  }, [currentID]);

  // const handleReplySubmit = async (parentId, parentType = "comment", replyToId = null) => {
  //   const replyKey = parentType === "comment" ? parentId : `${parentId}-${replyToId}`;
  //   const replyContent = replyContents[replyKey]?.trim();

  //   if (!replyContent) {
  //     toast({
  //       title: "Error",
  //       description: "Reply content cannot be empty.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   const taggedUserMatch = replyContent.match(/@(\w+)/);
  //   const taggedUser = taggedUserMatch ? taggedUserMatch[1] : null;

  //   const newReply = {
  //     commentId: parentType === "comment" ? parentId : replyToId,
  //     parentReplyId: parentType === "reply" ? parentId : null,
  //     author: user.name,
  //     text: replyContent,
  //     taggedUser: taggedUser,
  //   };

  //   try {
  //     const response = await AddReply(newReply);
  //     const addedReply = response.data.reply;

  //     setComments((prevComments) =>
  //       prevComments.map((comment) => {
  //         if (comment._id === (parentType === "comment" ? parentId : replyToId)) {
  //           if (parentType === "comment") {
  //             return {
  //               ...comment,
  //               replies: [
  //                 ...(comment.replies || []),
  //                 { ...addedReply, author: { name: user.name, imageUrl: user.imageUrl } },
  //               ],
  //             };
  //           } else {
  //             return {
  //               ...comment,
  //               replies: comment.replies.map((reply) =>
  //                 reply._id === parentId
  //                   ? {
  //                       ...reply,
  //                       replies: [
  //                         ...(reply.replies || []),
  //                         { ...addedReply, author: { name: user.name, imageUrl: user.imageUrl } },
  //                       ],
  //                     }
  //                   : reply
  //               ),
  //             };
  //           }
  //         }
  //         return comment;
  //       })
  //     );

  //     setReplyingTo(null);
  //     setReplyContents((prev) => ({ ...prev, [replyKey]: "" }));

  //     toast({
  //       title: "Success",
  //       description: "Reply added successfully.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (error) {
  //     console.error("Error adding reply:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to add reply. Please try again.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // const handleDeleteReply = async (replyId, parentCommentId) => {
  //   try {
  //     await deleteReply(replyId);
  //     setComments(prevComments =>
  //       prevComments.map(comment => {
  //         if (comment._id === parentCommentId) {
  //           return {
  //             ...comment,
  //             replies: comment.replies.filter(reply => {
  //               if (reply._id === replyId) return false;
  //               if (reply.replies) {
  //                 reply.replies = reply.replies.filter(r => r.parentReplyId !== replyId);
  //               }
  //               return true;
  //             })
  //           };
  //         }
  //         return comment;
  //       })
  //     );
  //     toast({
  //       title: "Success",
  //       description: "Reply deleted successfully.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete reply.",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  // const handleReplyTextChange = (e, replyKey, replyToName = "") => {
  //   const value = e.target.value;
  //   const position = e.target.selectionStart;
  //   setCursorPosition(position);

  //   if (value.endsWith("@")) {
  //     // Show user suggestions here
  //   }

  //   setReplyContents((prev) => ({
  //     ...prev,
  //     [replyKey]: value,
  //   }));
  // };

  // const RenderReply = ({ reply, parentCommentId, depth = 0 }) => {
  //   const replyKey = `${parentCommentId}-${reply._id}`;
  //   const imageUrl =
  //     reply.author?.imageUrl ||
  //     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  //   return (
  //     <Box ml={4} borderLeft="1px solid lightgray" pl={4} mt={2}>
  //       <HStack justify="space-between">
  //         <HStack>
  //           <Avatar
  //             src={imageUrl.startsWith("http") ? imageUrl : `${import.meta.env.VITE_BACK_END_URL}${imageUrl}`}
  //             name={reply.author?.name}
  //             size="xs"
  //           />
  //           <Text fontWeight="bold">{reply.author?.name}</Text>
  //           <Text fontSize="sm" color="gray.500">
  //             {new Date(reply.createdAt).toLocaleDateString()}
  //           </Text>
  //         </HStack>
  //         {reply.author?.name === user.name && (
  //           <IconButton
  //             size="sm"
  //             icon={<DeleteIcon />}
  //             onClick={() => handleDeleteReply(reply._id, parentCommentId)}
  //             aria-label="Delete reply"
  //           />
  //         )}
  //       </HStack>
  //       <Text mt={1}>
  //         {reply.taggedUser && <Text as="span" color="blue.500">@{reply.taggedUser} </Text>}
  //         {reply.text.replace(`@${reply.taggedUser}`, '')}
  //       </Text>

  //       {replyingTo === reply._id && depth < 2 && (
  //         <Box mt={2}>
  //           <Textarea
  //             bg="white"
  //             value={replyContents[replyKey] || ""}
  //             onChange={(e) => handleReplyTextChange(e, replyKey, reply.author?.name)}
  //             placeholder={`Reply to ${reply.author?.name}...`}
  //             rows={3}
  //             resize="vertical"
  //             autoFocus
  //           />
  //           <Button
  //             mt={2}
  //             colorScheme="teal"
  //             onClick={() => handleReplySubmit(reply._id, "reply", parentCommentId)}
  //           >
  //             Post Reply
  //           </Button>
  //           <Button
  //             mt={2}
  //             ml={2}
  //             onClick={() => {
  //               setReplyingTo(null);
  //               setReplyContents((prev) => ({ ...prev, [replyKey]: "" }));
  //             }}
  //           >
  //             Cancel
  //           </Button>
  //         </Box>
  //       )}

  //       {depth < 2 && (
  //         <Button
  //           size="sm"
  //           mt={2}
  //           onClick={() => {
  //             setReplyingTo(reply._id);
  //             setReplyContents((prev) => ({
  //               ...prev,
  //               [replyKey]: `@${reply.author?.name} `,
  //             }));
  //           }}
  //         >
  //           Reply
  //         </Button>
  //       )}

  //       {reply.replies &&
  //         reply.replies
  //           .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  //           .map((nestedReply) => (
  //             <RenderReply
  //               key={`${parentCommentId}-${nestedReply._id}`}
  //               reply={nestedReply}
  //               parentCommentId={parentCommentId}
  //               depth={depth + 1}
  //             />
  //           ))}
  //     </Box>
  //   );
  // };

  return (
    <VStack spacing={4} align="stretch" >
      {comments.length > 0 ? (
        comments?.map((comment) => (
          <Box bg={'white'} key={comment._id} borderWidth={1} borderRadius="md" p={4} boxShadow={'lg'} >
            <HStack justify="space-between">
              <HStack>
                <Avatar
                  src={ `${import.meta.env.VITE_BACK_END_URL}${ comment.author?.imageUrl}`||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  name={comment.author?.name}
                  size="sm"
                />
                <Text fontWeight="bold">{comment.author?.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
              </HStack>
              {comment.author?.name === user.name && (
                <IconButton
                  size="sm"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteComment(comment._id)}
                  aria-label="Delete comment"
                />
              )}
            </HStack>
            <Text mt={2}>{comment.text}</Text>

            {/* {replyingTo === comment._id ? (
              <Box mt={4}>
                <Textarea
                  bg="white"
                  value={replyContents[comment._id] || ""}
                  onChange={(e) => handleReplyTextChange(e, comment._id, comment.author?.name)}
                  placeholder="Write a reply..."
                  rows={3}
                  resize="vertical"
                  autoFocus
                />
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() => handleReplySubmit(comment._id, "comment")}
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
                  setReplyContents((prev) => ({
                    ...prev,
                    [comment._id]: `@${comment.author?.name} `,
                  }));
                }}
              >
                Reply
              </Button> */}
            {/* )} */}

            {/* {comment.replies?.map((reply) => (
              <RenderReply key={reply._id} reply={reply} parentCommentId={comment._id} depth={0} />
            ))} */}
          </Box>
        ))
      ) : (
        <Text>No comments available.</Text>
      )}
    </VStack>
  );
}