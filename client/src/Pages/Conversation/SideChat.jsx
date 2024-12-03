import { Box, Text, VStack, Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { getSideBarParticipants } from '../../Api/Chats';

export default function SideChat({ ownerIdDetails, userIdDetails, listingIdDetails }) {
    const [participants, setParticipants] = useState([]);

    useEffect(()=>{
        const GetSideChat = async()=>{
            try{
                const conversation  = await getSideBarParticipants();
                setParticipants(conversation.data.participants);
            }
            catch(error)
            {
               console.log(error);
            }
        }
        GetSideChat();

    },[])
   
    return (
        <Box
          width="20%"
          height="100vh"
          bg="gray.100"
          borderRight="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <VStack spacing={4} align="stretch">
            {participants.map((participant) => (
              <Box 
                key={participant._id}
                display="flex"
                alignItems="center"
                cursor="pointer" 
                p={2} 
                bg="gray.200" 
                borderRadius="md"
              >
                <Avatar 
                  size="sm" 
                  
                  src={(`${import.meta.env.VITE_BACK_END_URL}${participant.user.imageUrl}`)} 
                  name={participant.user.name} 
                  mr={2}
                />
                <Text>{participant.user.name}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      );
  
}