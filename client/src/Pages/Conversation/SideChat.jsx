import { Avatar, Box, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants , fetchConversationsForSidebar } from '../../Api/Chats';

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export default function SideChat({ handleSideBarClick, ownerIdDetails, setAllData , allData}) {
  const [participants, setParticipants] = useState([]);
  const [owner, setOwner] = useState(null);
  const [searchChat, setSearchChat] = useState('');
 
  // const [avatar,setAvatar] = useState(''); 
  // const [participantName , setParticipantName] = useState([]);

  // Fetch participants from the API
  useEffect(() => {
    const fetchParticipants = async () => {
        try {
            const response = await fetchConversationsForSidebar();
            console.log("Sidebar conversations:", response.data.data);
            setAllData(response.data.data);
            
            const participantData = response?.data?.data.flatMap(item => 
                item.participants
            ).filter(Boolean);
            
            console.log("Filtered participants:", participantData);
            setParticipants(participantData);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };
    fetchParticipants();

    
}, []);



///newiest usee effect
// useEffect(()=>{
//  console.log("all data for id", allData);
//  const participantData = allData.flatMap(item => 
//   item.participants
// ).filter(Boolean);
// console.log("Filtered people of new:", participantData);
// //  setParticipants(participantData);

// },[allData])


// useEffect(() => {
//   console.log("Setting up newConversation listener");
  
//   socket.on("newConversation", (data) => {
//     setAllData(prevData => {
//         const newData = prevData ? [...prevData] : [];
//         const exists = newData.some(conv => conv._id === data.conversation._id);
//         if (!exists) {
//             newData.push(data.conversation);
//         } else {
//             // Update existing conversation and move to top
//             newData = newData.map(conv => 
//                 conv._id === data.conversation._id ? data.conversation : conv
//             );
//         }
//         return newData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//     });
// });

// return () => {
//     socket.off("newConversation");
// };
// }, []);

useEffect(() => {
  socket.on("receiveMessage", (data) => {
    setAllData(prevData => {
      return prevData.map(conv => {
        if (conv._id === data.conversationId) {
          return { 
            ...conv, 
            unreadMessagesCount: (conv.unreadMessagesCount || 0) + 1
          };
        }
        return conv;
      });
    });
  });

  return () => {
    socket.off("receiveMessage");
  };
}, []);


  // Set the owner details
  useEffect(() => {
    if (ownerIdDetails?.name) {
      setOwner({ _id: ownerIdDetails._id, name: ownerIdDetails.name, email:ownerIdDetails.email, 
        imageUrl: ownerIdDetails.imageUrl
         });
      console.log("Owner name in side chat:", ownerIdDetails.name);

     
    }
  }, [ownerIdDetails]);

  const combinedList = React.useMemo(() => {
    if (!owner) return participants;
    const isOwnerInParticipants = participants.some((participant) => participant._id === owner._id);
    return isOwnerInParticipants ? participants : [owner, ...participants];
  }, [participants, owner]);

  useEffect(()=>{
    console.log("combines", combinedList)
    
  },[combinedList])

  return (
    <Box
      width={{ base: "100%", md: "20%" }}
     
      bg="orange.100"
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        
        <Text color={'orange.500'} fontWeight="bold">Chats</Text>


        <Input bg={'orange.50'}  type='text' placeholder='Search Chat' color={'orange.600'} onChange={(e)=> setSearchChat(e.target.value)} />


        {combinedList && combinedList.length > 0 ? (
          combinedList.filter((item)=> 
            item.name.toLowerCase().includes(searchChat.toLowerCase())

          ).map((item, i) => (
            <Box
            _active={{bg:'orange.50'}}
              key={item._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              
              bg="orange.200"
              borderRadius="md"
              onClick={() => handleSideBarClick(item._id, item.name, item, item.imageUrl)}
            >
     
              <Avatar mr={3} src={`${import.meta.env.VITE_BACK_END_URL}${item.imageUrl}`|| item.imageUrl} />
              <Text color={'orange.600'}  >{item.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )}

      </VStack>
    </Box>
  );
}