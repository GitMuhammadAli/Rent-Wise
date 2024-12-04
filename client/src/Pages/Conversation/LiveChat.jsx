import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import {createMessage, fetchMessagesByConversation} from '../../Api/Chats'


export default function LiveChat({owner,listingIdDetails, ownerIdDetails, Messages, setMessages , listing}) {
  const [message, setMessage] = useState('');
  const [convoID, setConvoId] = useState('');
 


  useEffect(()=>{
       
        console.log("Onwer is live chat is-->", owner);
        console.log("lsiting id", listing)


        const fetchMessages = async()=>{
          if(!owner)
            {
              console.log("no owner in live chat rn")
              return
            }
          if(!convoID)
          {
            console.log("no convo id yet")
            return
          }
          try {
            console.log("convo in func is:", convoID)
            const values = await fetchMessagesByConversation(convoID);

           
            const messagesToSet = values?.data?.data || [];
            console.log("fetch messages are",  messagesToSet)
            setMessages(messagesToSet);
            
          } catch (error) {
           console.log("errors", error) 
          }
        }
        fetchMessages()
      
  },[convoID, owner])


  const handleMessageSubmit = async(e)=>{
    e.preventDefault();

    try {
      console.log("messageIS", message);
        console.log("lsiting id in func", listingIdDetails)
        console.log("Onwer is live chat is-->", owner);
       

      const data = { message, listing:listingIdDetails, receiver: owner._id }
      const values = await createMessage(data); 
      console.log("meess",values.data.data.message)
      console.log("convo",values.data.data.conversation)
      setConvoId(values.data.data.conversation);
    
     setMessage('')
      console.log("Data of response of messages is:", values)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
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
          <HStack borderBottom={'1px solid gray'} bg={'red.200'} h={'70px'}>
            {
              owner && (
                <Box>
                  <Text>{owner.name}</Text>

                </Box>

              )
                
              
            }

          </HStack>
          <Box flex="1" height="300px" overflowY="scroll" bg="gray.50" borderRadius="md" p={4}>
           {/* display messages her */}

           {
            Messages && Messages.length > 0 && Messages.map((Messages,i)=>(
              <Box key={Messages._id  || i }> 
              <Text>{Messages.message}</Text>
               </Box>

            )) 
              
            
           }
          </Box>
          <HStack mt={4}>
            <form onSubmit={handleMessageSubmit}>
            <Input
              placeholder="Type your message..."
              border="none"
              bg="gray.100"
              borderRadius="md"
              _focus={{ boxShadow: "outline" }}
              value={message}
              onChange={(e)=> setMessage(e.target.value)}
            />
            <Button type='submit' colorScheme="blue">Send</Button>
            </form>
          </HStack>
        </Box>
      );
}
