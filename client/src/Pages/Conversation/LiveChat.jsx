// import { Box, Button, Flex, HStack, Input, Text } from '@chakra-ui/react';
// import React, { useEffect, useState } from 'react'
// import { useAuth } from '../../hooks/AuthContext';
// import {createMessage, fetchMessagesByConversation} from '../../Api/Chats'
// import { io } from "socket.io-client";

// const socket = io('http://localhost:3600')


// export default function LiveChat({owner,listingIdDetails,convoID,setConvoId, ownerIdDetails, Messages, setMessages , listings}) {
//   const [message, setMessage] = useState('');
//   const { user } = useAuth();
//   const [localListingId, setLocalListingId] = useState([]); // listings detail is comming from main chat, this state is used to just set the id's from that listing so can send while creating messages

//   useEffect(() => {
//     console.log("lsiting is effect 1 ", listings)
//     // Compute listing IDs when listings change
//     const listing_id = listings.map(list => list._id);
//     console.log("listIIID in live chat", listing_id);
//     setLocalListingId(listing_id);
//   }, [listings]);


//   useEffect(() => {
//     if (!convoID) return;

//     // Join the room for this conversation
//     socket.emit('join-conversation', convoID);

//     // Listen for new messages and update the messages state
//     socket.on('receive-message', (newMessage) => {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     // Clean up the listener when the component unmounts or conversation changes
//     return () => {
//         socket.emit('leave-conversation', convoID);
//         socket.off('receive-message');
//     };
// }, [convoID]);


//   const handleMessageSubmit = async(e)=>{
//     e.preventDefault();

//     try {
//       console.log("messageIS", message);
//         console.log("lsiting id in func", listingIdDetails)
//         console.log("local lsiting id in func", localListingId)
//         console.log("Onwer is live chat is-->", owner);
       

//         const listingsToSend = listingIdDetails || localListingId; // the localListingId is the one comming from directChat

//         if (!listingsToSend || listingsToSend.length === 0) {
//           console.log("No listing IDs available, neither from Chat with Owner, nor from Direct Chat");
//           return;
//         }
    
//         const data = { message, listing: listingsToSend, receiver: owner._id };
//         console.log("Data to be sent for creating messages is", data);


//         socket.emit('send-message', data);

//       const values = await createMessage(data); 
//       console.log("Data of response of messages is:", values)
//       console.log("meess",values?.data?.data?.message)
//       console.log("convo",values.data.data.conversation)
//       setConvoId(values.data.data.conversation);
//       console.log("convoAg",convoID)
    
//      setMessage('')
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   }




//   useEffect(()=>{
//     if(!user)
//     {
//       console.log('no user')
//     }
//     console.log("userHEre", user)
       
//     console.log("Onwer is live chat is-->", owner);
//     console.log("lsiting ", listings)

//     // const listing_id = listings.map(list=>(
//     //  list._id
//     // ))
//     // console.log("listIIID in live chat",listing_id)
//     // setLocalListingId(listing_id);

//     const fetchMessages = async()=>{
//       if(!owner)
//         {
//           console.log("no owner in live chat rn")
//           return
//         }
//       if(!convoID)
//       {
//         console.log("no convo id yet")
//         return
//       }
//       else
//       {
//          console.log("convo Id while fetching", convoID)
//       }
//       try {
//         const values = await fetchMessagesByConversation(convoID);
//         setMessages(values?.data?.data || []);
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//     }
//       // try {
//       //   console.log("convo in func is:", convoID)
//       //   const values = await fetchMessagesByConversation(convoID);

       
//       //   const messagesToSet = values?.data?.data || [];
//       //   console.log("fetch messages are",  messagesToSet)
//       //   setMessages(messagesToSet);
        
//       // } catch (error) {
//       //  console.log("errors", error) 
//       // }
//     }
//     fetchMessages()
  
// },[convoID, owner, listings])
//     return (
//         <Box
//           flex="1"
         
//           bg="white"
//           boxShadow="md"
          
//           borderColor="gray.200"
//           borderRadius="md"
//         >
//           <HStack color={'white'} borderBottom={'1px solid gray'} p={4} bg={'gray.800'} h={'70px'}>
//             {
//               owner && (
//                 <Box>
//                   <Text>{owner.name}</Text>

//                 </Box>

//               )
                
              
//             }

//           </HStack>
//           <Box flex="1"  height="300px" overflowY="scroll" bg="gray.800" borderRadius="md" display={'flex'}
//            p={6}
//            flexDir={'column'}
//            gap={4}
//            >
//            {/* display messages her */}

//            {
//             Messages && Messages.length > 0 && Messages.map((Messages,i)=>(
//               <Box
              
//               alignSelf={Messages.sender._id === user?._id ? 'flex-end' : 'flex-start'}
//               bg={Messages.sender._id === user?._id ? 'green.600' : 'gray.600'}
//               color={'white'}
//               borderRadius={'8px'}
//               p={2}
//               key={Messages._id  || i }> 
//               <Text>{Messages.message}</Text>
//                </Box>

//             )) 
              
            
//            }
//           </Box>

//           <Flex mt={4} >

            
//             <form onSubmit={handleMessageSubmit} style={{width:'100%'}}>
//               <Flex >
//               <Input
            
//               placeholder="Type your message..."
//               border="none"
//               bg="gray.100"
//               borderRadius="md"
//               _focus={{outline:'none'}}
//               value={message}
//               onChange={(e)=> setMessage(e.target.value)}
              
//             />
//             <Button type='submit' colorScheme="blue">Send</Button>
//               </Flex>
            
//             </form>
            
//           </Flex>
//         </Box>
//       );
// }



import { Box, Button, Flex, HStack, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";
import { io } from "socket.io-client";

const socket = io("http://localhost:3600"); // Ensure backend runs on this port

export default function LiveChat({
  owner,
  listingIdDetails,
  convoID,
  setConvoId,
  ownerIdDetails,
  Messages,
  setMessages,
  listings,
}) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [localListingId, setLocalListingId] = useState([]);

  useEffect(() => {
    if (listings) {
      const listing_id = listings.map((list) => list._id);
      setLocalListingId(listing_id);
    }
  }, [listings]);

  useEffect(() => {
    if (!convoID) return;

    console.log("Joining conversation ID:", convoID);
    socket.emit("join-conversation", convoID);

    socket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);
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
      const listingsToSend = listingIdDetails || localListingId;

      if (!listingsToSend || listingsToSend.length === 0) {
        console.error("No listing IDs available.");
        return;
      }

      const data = {
        message,
        listing: listingsToSend,
        receiver: owner._id, 
      };

      console.log("Sending message data:", data);
      socket.emit("send-message", data); 

      const response = await createMessage(data);
      if (response.status === 200) {
        setConvoId(response.data.data.conversation); 
        setMessages((prevMessages) => [...prevMessages, response.data.message]); 
      }

      setMessage(""); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!owner || !convoID) return;

      try {
        const response = await fetchMessagesByConversation(convoID);
        setMessages(response?.data?.data || []);
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
          <HStack color={'white'} borderBottom={'1px solid gray'} p={4} bg={'gray.800'} h={'70px'}>
            {
              owner && (
                <Box>
                  <Text>{owner.name}</Text>

                </Box>

              )
                
              
            }

          </HStack>
          <Box flex="1"  height="300px" overflowY="scroll" bg="gray.800" borderRadius="md" display={'flex'}
           p={6}
           flexDir={'column'}
           gap={4}
           >
           {/* display messages her */}

           {
            Messages && Messages.length > 0 && Messages.map((Messages,i)=>(
              <Box
              
              alignSelf={Messages.sender._id === user?._id ? 'flex-end' : 'flex-start'}
              bg={Messages.sender._id === user?._id ? 'green.600' : 'gray.600'}
              color={'white'}
              borderRadius={'8px'}
              p={2}
              key={Messages._id  || i }> 
              <Text>{Messages.message}</Text>
               </Box>

            )) 
              
            
           }
          </Box>

          <Flex mt={4} >

            
            <form onSubmit={handleMessageSubmit} style={{width:'100%'}}>
              <Flex >
              <Input
            
              placeholder="Type your message..."
              border="none"
              bg="gray.100"
              borderRadius="md"
              _focus={{outline:'none'}}
              value={message}
              onChange={(e)=> setMessage(e.target.value)}
              
            />
            <Button type='submit' colorScheme="blue">Send</Button>
              </Flex>
            
            </form>
            
          </Flex>
        </Box>
      );
 
}
