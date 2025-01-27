import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";
import UserPopover from "../DashboardComp.jsx/UserPopover";
import { ListingsContext } from "../../hooks/ListingsContext";
import { Link } from 'react-router-dom';

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export default function LiveChat({
  showPopOver,
  scrollRef,
  owner,
  listingIdDetails,
  convoID,
  setConvoId,
  Messages,
  setMessages,
  listings,
}) {
  const [message, setMessage] = useState("");

  const { user } = useAuth();
  const [localListingId, setLocalListingId] = useState([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [message]);



  useEffect(() => {
    if (listings) {
      const listing_id = listings.map((list) => list._id);
      setLocalListingId(listing_id);
    }
  }, [listings]);

  useEffect(() => {
    if (!convoID) return;

    console.log("i am refreshed")
    console.log("Joining conversation ID:", convoID);
    socket.emit("join-conversation", convoID);

    socket.on("receiveMessage", (newMessage) => {
      console.log("New message received on frontend:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      console.log("Leaving conversation ID:", convoID);
      socket.emit("leave-conversation", convoID);
      socket.off("receiveMessage");
    };
  }, [convoID]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    try {
      const listingsToSend = listingIdDetails || localListingId || [];

      // if (listingIdDetails || localListingId) {
      //   if (listingsToSend.length === 0) {
      //     console.error("No listing IDs available.");
      //     return;
      //   }
      // }

      const data = {
        message,
        listing: listingsToSend,
        receiver: owner._id,
      };

      console.log("Sending message data:", data);

      const response = await createMessage(data);

      if (response) {
        console.log("response after message created", response.data.data);
        setConvoId(response.data.data.conversation);
        // setMessages((prevMessages) => [...prevMessages, response?.data?.data]);
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!owner || !convoID) return;
      console.log("oowner is", owner);

      try {
        const response = await fetchMessagesByConversation(convoID);
        setMessages(response?.data?.data || []);
        console.log("meessages in live are:", response?.data?.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [convoID, owner]);
  return (
    <Box
      flex="1"
      bg="white"
      boxShadow="md"
      borderColor="gray.200"
      borderRadius="md"
    >
      <HStack
        display={"flex"}
        justifyContent={"space-between"}
        color={"white"}
        borderBottom={"1px solid gray"}
        p={4}
        bg={"orange.100"}
        h={"70px"}
      >
        {owner && (
          <Flex alignItems={"center"} color={'orange.600'}>
            <Link
              to={`/profile/${owner._id}`}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Avatar
                mr={3}
                src={
                  `${import.meta.env.VITE_BACK_END_URL}${owner.imageUrl}` ||
                  owner.imageUrl
                }
              />
              <Text>{owner.name}</Text>
            </Link>
          </Flex>
        )}
        {
          // sending data to agreement
          owner && showPopOver && (
            <UserPopover convoID={convoID} tenant={owner} />
          )
        }
      </HStack>
      <Box
        flex="1"
        ref={scrollRef}
        height="300px"
        overflowY="scroll"
        bg="orange.100"
        borderRadius="md"
        display={"flex"}
        p={6}
        flexDir={"column"}
        gap={4}
      >
        {Messages &&
          Messages.length > 0 &&
          Messages.map((Messages, i) => (
            <Box
              key={Messages._id || i}
              color={"white"}
              borderRadius={"8px"}
              w={"fit-content"}
              p={2}
              bg={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "orange.700"
                  : "orange.300"
              }
              alignSelf={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "flex-end"
                  : "flex-start"
              }
            >
              <Text>{Messages.message}</Text>
            </Box>
          ))}
      </Box>

      <Flex mt={4}>
        <form onSubmit={handleMessageSubmit} style={{ width: "100%" }}>
          <Flex>
            <Input
              placeholder="Type your message..."
              border="none"
              bg="gray.100"
              borderRadius="md"
              _focus={{ outline: "none" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" colorScheme="blue">
              Send
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
}
