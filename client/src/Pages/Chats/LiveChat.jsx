import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { createChatAPI, getChatsAPI } from "./../../Api/Chats";

export default function LiveChat({
  users,
  userDetails,
  ownerIdDetails,
  userIdDetails,
  listingIdDetails,
}) {
  const [source, setSource] = useState("");
  const [displayUser, setDisplayUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userDetails?.status === "offline") {
      setSource("/images/round.png");
    } else {
      setSource("/images/button.png");
    }
  }, [userDetails?.status]);

  useEffect(() => {
    if (userIdDetails?._id === ownerIdDetails?._id) {
      setDisplayUser(userIdDetails);
    } else {
      setDisplayUser(ownerIdDetails);
    }
  }, [userIdDetails, ownerIdDetails]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userIdDetails?._id || !listingIdDetails?._id || !displayUser?._id) return;

        console.log("Fetching messages for user:", userIdDetails._id);
        console.log("Fetching messages for listing:", listingIdDetails._id);
        const response = await getChatsAPI(displayUser._id, listingIdDetails._id);
        if (response?.data?.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (displayUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); 
      return () => clearInterval(interval);
    }
  }, [displayUser, listingIdDetails, userIdDetails]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (!userIdDetails?._id || !displayUser?._id || !listingIdDetails?._id) return;

      const messageData = {
        senderId: userIdDetails._id, 
        receiver: displayUser._id,  
        message: message.trim(),
        listing: listingIdDetails._id,
      }

      await createChatAPI(messageData);
      setMessage("");
      const param = `userId=${userIdDetails._id}&listingId=${listingIdDetails._id}&otherUserId=${displayUser._id}`;
      const response = await getChatsAPI(param);
      if (response?.data?.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Flex
        justifyContent={"space-between"}
        flexDir={"column"}
        borderLeft={"1px solid gray"}
        bg={"white"}
        w={"60vw"}
        h={"100%"}
      >
        {users && displayUser && (
          <Flex
            gap={4}
            alignItems={"center"}
            borderBottom={"1px solid gray"}
            p={"20px"}
          >
            <Avatar
              src={
                displayUser.imageUrl
                  ? `${import.meta.env.VITE_BACK_END_URL}${
                      displayUser.imageUrl
                    }`
                  : undefined
              }
            />
            <Flex flexDir={"column"}>
              <Text fontWeight={"bold"}>{displayUser.name}</Text>
              <Flex alignItems={"center"} gap={1}>
                <Image w={"8px"} h={"8px"} src={source} alt="status image" />
                <Text fontSize={"sm"}>{displayUser.status}</Text>
              </Flex>
            </Flex>
          </Flex>
        )}

        <Flex flexDir="column" flex={1} overflowY="auto" p={4}>
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justifyContent={
                msg.sender._id === userIdDetails?._id ? "flex-end" : "flex-start"
              }
              mb={2}
            >
              <Box
                bg={
                  msg.sender._id === userIdDetails?._id ? "blue.500" : "gray.200"
                }
                color={msg.sender._id === userIdDetails?._id ? "white" : "black"}
                p={2}
                borderRadius="lg"
              >
                {msg.message}
              </Box>
            </Flex>
          ))}
        </Flex>

        <Flex
          borderTop={"1px solid gray"}
          p={3}
          w={"full"}
          alignItems={"center"}
          alignSelf={"end"}
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type your message here"
            w={"100%"}
            type="text"
            bg={"white"}
            borderRadius={"none"}
            border={"none"}
            _focus={{
              boxShadow: "none",
              borderColor: "transparent",
            }}
          />
          <SendHorizontal
            onClick={handleSendMessage}
            style={{ cursor: "pointer" }}
          />
        </Flex>
      </Flex>
    </div>
  );
}