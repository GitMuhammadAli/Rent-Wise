import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { SendIcon } from 'lucide-react'
import {createChatAPI , getChatsAPI} from '../../Api/Chats'

const ChatComponent = ({ currentUserId, ownerId, listingId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    fetchMessages()
    const intervalId = setInterval(fetchMessages, 5000) // Poll for new messages every 5 seconds
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const queryParams = `sender=${currentUserId}&receiver=${ownerId}&listing=${listingId}`
      const response = await getChatsAPI(queryParams)
      setMessages(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error fetching messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

//   const sendMessage = async () => {
//     if (newMessage.trim() === '') return

//     try {
//       await createChatAPI({
//         ownerId: ownerId,
//         message: newMessage,
//         listing: listingId,
//         replyTo: true
//       })
//       console.log('Message sent successfully')

//       setNewMessage('')
//       await fetchMessages() // Refetch messages to include the new one
//     } catch (error) {
//       console.error('Error sending message:', error)
//       toast({
//         title: 'Error sending message',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       })
//     }
//   }
const sendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    try {
      // Prepare the message data
      const data = {
        // sender: currentUserId,
        receiver: ownerId,
        message: newMessage.trim(),
        listing: listingId,
        replyTo: messages.length > 0 ? messages[messages.length - 1]._id : null, // Handle replyTo if applicable
      };
  
      console.log('Sending message data:', data);
  
      // Send the message data to the backend
      const response = await createChatAPI(data);
      console.log('Message sent successfully', response);
  
      setNewMessage(''); // Clear input field
      fetchMessages();   // Refetch messages to include the new one
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    )
  }

  return (
//     <Box height="100vh" display="flex" flexDirection="column">
//       <Box bg="blue.500" color="white" p={4}>
//         <Text fontSize="xl" fontWeight="bold">Chat</Text>
//       </Box>
//       <VStack flex={1} overflowY="auto" p={4} spacing={4} alignItems="stretch">
//         {/* {messages.map((message) => (
//           <HStack
//             key={message._id}
//             alignSelf={message.sender === currentUserId ? 'flex-end' : 'flex-start'}
//             maxW="70%"
//           >
//             {message.sender !== currentUserId && (
//               <Avatar size="sm" name={message.sender === ownerId ? 'Owner' : 'User'} />
//             )}
//             <Box
//               bg={message.sender === currentUserId ? 'blue.500' : 'gray.100'}
//               color={message.sender === currentUserId ? 'white' : 'black'}
//               borderRadius="lg"
//               px={3}
//               py={2}
//             >
//               <Text>{message.message}</Text>
//               <Text fontSize="xs" color={message.sender === currentUserId ? 'blue.100' : 'gray.500'} textAlign="right">
//                 {formatTimestamp(message.createdAt)}
//               </Text>
//             </Box>
//           </HStack>
//         ))} */}
//         {messages.map((message) => (
//   <HStack
//     key={message._id}
//     alignSelf={message.sender === currentUserId ? 'flex-end' : 'flex-start'}
//     maxW="70%"
//   >
//     {message.sender !== currentUserId && (
//       <Avatar size="sm" name={message.sender === ownerId ? 'Owner' : 'User'} />
//     )}
//     <Box
//       bg={message.sender === currentUserId ? 'blue.500' : 'gray.100'}
//       color={message.sender === currentUserId ? 'white' : 'black'}
//       borderRadius="lg"
//       px={3}
//       py={2}
//     >
//       <Text>{message.message}</Text>
//       {message.replyTo && (
//         <Box mt={2} bg="gray.200" p={2} borderRadius="md">
//           <Text fontSize="sm" color="gray.600">Replying to:</Text>
//           <Text>{message.replyTo.message}</Text>  {/* Show the original message */}
//         </Box>
//       )}
//       <Text fontSize="xs" color={message.sender === currentUserId ? 'blue.100' : 'gray.500'} textAlign="right">
//         {formatTimestamp(message.createdAt)}
//       </Text>
//     </Box>
//   </HStack>
// ))}

//         <div ref={messagesEndRef} />
//       </VStack>
//       <HStack as="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }} p={4} spacing={4}>
//         <Input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           flex={1}
//         />
//         <Button type="submit" colorScheme="blue" rightIcon={<SendIcon size={16} />}>
//           Send
//         </Button>
//       </HStack>
//     </Box>

<p>this is chat</p>
  )
}

export default ChatComponent