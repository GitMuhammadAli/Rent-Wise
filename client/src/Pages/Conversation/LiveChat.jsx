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
  isCLicked,
  setIsCLicked,
  checkClick,
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
    if (!convoID) return ;

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
        setIsCLicked(false)
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [convoID, owner, isCLicked]);
  return (
    <Flex
     flexDir={'column'}
      flex="1"

      bg="gray.50"
      boxShadow="md"
      // borderColor="gray.200"
      borderRadius="md"
      w={{base:'100%', sm:'75%'}}
      h={'100%'}
      display={{ base: checkClick ? 'inherit' : 'none', md: 'inherit' }}
    >

      {/* top bar of live chat */}
      <HStack
        display={"flex"}
        justifyContent={"space-between"}
        color={"white"}
        p={4}
        bg={"white"}
        h={"80px"}
        borderBottom={'gray.200'}
       
      >
        {owner && (
          <Flex alignItems={"center"}>
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
                size={{base:'sm',sm:'md'}}
                src={
                  `${import.meta.env.VITE_BACK_END_URL}${owner.imageUrl}` ||
                  owner.imageUrl
                }
              />
              <Text color={'black'} fontWeight={'semibold'} fontSize={{base:'sm', sm:'lg', md:'xl'}}>{owner.name}</Text>
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
        borderTop={'1px solid #E0E0E0'}
        borderBottom={'1px solid #E0E0E0'}
        
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
              color={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "white"
                  : "gray.700"
              }
              borderRadius={"8px"}
              w={"fit-content"}
              maxW={{base:'200px',sm:'350px'}}
              p={2}
              bg={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "orange.500"
                  : "white"
              }
              border={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "none"
                  : "1px solid #E0E0E0"
              }
              alignSelf={
                (Messages.sender._id || Messages.sender) === user?._id
                  ? "flex-end"
                  : "flex-start"
              }
            >
              <Text wordBreak="break-word" fontSize={'sm'}>{Messages.message}</Text>
            </Box>
          ))}
      </Box>

      <Flex bg={'white'} py={6}>
        <form onSubmit={handleMessageSubmit} style={{ width: "100%" }}>
          <Flex >
            <Input
          
              placeholder="Type your message..."
              // border="none"
              mx={4}
              bg="white"
              borderRadius="full"
              _focus={{ outline: "none",}}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" colorScheme="orange" rounded={'full'} mr={2}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}
