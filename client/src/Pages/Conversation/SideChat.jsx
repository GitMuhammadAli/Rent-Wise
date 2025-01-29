import { Avatar, Box, Flex, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants , fetchConversationsForSidebar } from '../../Api/Chats';

import { io } from "socket.io-client";
import { useAuth } from '../../hooks/AuthContext';

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export default function SideChat({ handleSideBarClick, ownerIdDetails, setAllData ,
   allData, isCLicked, checkClick}) {
  const [participants, setParticipants] = useState([]);
  const [owner, setOwner] = useState(null);
  const [searchChat, setSearchChat] = useState('');
  const {user} = useAuth();
  const [activeItem, setActiveItem] = useState(null);
 
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
useEffect(()=>{
 console.log("all data for id", allData);
 const participantData = allData?.flatMap(item => 
  item.participants
).filter(Boolean);
console.log("Filtered people of new:", participantData);
if (participantData !== undefined) {
  // Step 2: Remove duplicates based on _id
  const uniqueParticipants = Array.from(
    new Map(participantData.map((participant) => [participant._id, participant])).values()
  );

  // Step 3: Set participants to the unique list
  setParticipants(uniqueParticipants);
 
}
},[allData])


useEffect(() => {
  socket.on("receiveMessage", (data) => {
    console.log("message rec in side")
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
    console.log("participants in memo:", participants);
  
    // Step 1: Filter out the user themselves
    const checkUser = participants?.filter(
      (participant) => participant._id !== user?._id
    );
  
    // Step 2: If there's no owner, return the filtered list
    if (!owner) return checkUser;
  
    // Step 3: Check if the owner is already in the list
    const isOwnerInParticipants = checkUser?.some(
      (participant) => participant._id === owner._id
    );
    
    console.log("CheckUSer", checkUser)
  
    // Step 4: Return the final combined list
    return isOwnerInParticipants
      ? checkUser
      : [owner, ...checkUser];
  }, [participants, owner, user]);
  

  useEffect(()=>{
    console.log("combines", combinedList)
    
  },[combinedList])

  return (
    <Box
      width={{ base: "100%", sm:'25%'}}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      display={{ base: !checkClick ? 'initial' : 'none', md: 'initial' }}
      
    >
      <VStack align={'stretch'}>
        
        <Flex flexDir={'column'} gap={3} p={2}>
        <Text color={'orange.500'} fontSize={'xl'} fontWeight="bold">Chats</Text>
        <Input bg="gray.50"  type='text' placeholder='Search Chat' color={'orange.600'} onChange={(e)=> setSearchChat(e.target.value)} />
        </Flex>
        


        {combinedList && combinedList.length > 0 ? (
          combinedList.filter((item)=> 
            item.name.toLowerCase().includes(searchChat.toLowerCase())

          ).map((item, i) => (
            <Box
            _hover={{bg: activeItem === item._id ? 'orange.50' : 'gray.50'}}
            bg={activeItem === item._id ? 'orange.50' : 'transparent'}
              key={item._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              px={3}
              py={3}
              onClick={() => {
                setActiveItem(item._id);
                handleSideBarClick(item._id, item.name, item, item.imageUrl)
              }}
            >
     
              <Avatar mr={3} src={`${import.meta.env.VITE_BACK_END_URL}${item.imageUrl}`|| item.imageUrl} />
              <Text fontWeight={'semibold'}>{item.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )}

      </VStack>
    </Box>
  );
}