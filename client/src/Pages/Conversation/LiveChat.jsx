import { Box, Button, HStack, Input ,   Flex} from '@chakra-ui/react';
import React , { useState , useEffect } from 'react'
import { createMessage , fetchMessagesByConversation } from '../../Api/Chats';

export default function LiveChat({ ownerIdDetails, userIdDetails, listingIdDetails }) {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [displayUser, setDisplayUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [source, setSource] = useState('');


  useEffect(() => {
    console.log("userIdDetails in live chat", userIdDetails);
    console.log("ownerIdDetails in live chat", ownerIdDetails);
    console.log("listingIdDetails in live chat", listingIdDetails);
   
  })


    return (
        <Box
          flex="1"
          p={4}
          bg="white"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
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
              {
                userDetails && ( <>
                  <Text fontWeight={"bold"}>{userDetails.name}</Text>
                  <Flex alignItems={"center"} gap={1}>
                    <Image w={"8px"} h={"8px"} src={source} alt="status image" />
                    <Text fontSize={"sm"}>{displayUser.status}</Text>
                  
                  </Flex>
                  </>) 
              }
             
            </Flex>
          </Flex>
        )}
          <Box flex="1" height="300px" overflowY="scroll" bg="gray.50" borderRadius="md" p={4}>
            {/* Messages will appear here */}
          </Box>
          <HStack mt={4}>
            <Input
              placeholder="Type your message..."
              border="none"
              bg="gray.100"
              borderRadius="md"
              _focus={{ boxShadow: "outline" }}
            />
            <Button colorScheme="blue">Send</Button>
          </HStack>
          </Flex>
        </Box>
      );
}
