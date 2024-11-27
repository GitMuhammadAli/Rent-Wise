import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { fetchConversationsForSidebar } from '../../Api/Chats';

export default function SideChat() {


    useEffect(()=>{
        const GetSideChat = async()=>{
            try{
                const conversation  = await fetchConversationsForSidebar();
                console.log("conversation side", conversation);
    
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
            <Text cursor="pointer" p={2} bg="gray.200" borderRadius="md" textAlign="center">
              Chat 1
            </Text>
          </VStack>
        </Box>
      );
  
}
