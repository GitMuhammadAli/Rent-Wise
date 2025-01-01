import { Avatar, Box, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants , fetchConversationsForSidebar } from '../../Api/Chats';


export default function SideChat({ handleSideBarClick, ownerIdDetails,setListings, setAllData }) {
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
        console.log("response", response);
        
        // const participantData = response.data.data[0].participants || [];
        // const listingData = response.data.data[0].listing || [];
        const participantData = response?.data?.data.flatMap(item =>
          item.participants
        );

           // to directly get anything from participants data but make sure to add that column above first
        // const participantNames = participantData.map(participant => participant.name);
        // console.log(participantNames);
        

        const listingData = response?.data?.data.flatMap(item => item.listing);




        console.log("Participants are: ", participantData);
        console.log("Listings are: ", listingData);
         setParticipants(participantData);
        setListings(listingData);
       
        setAllData(response.data.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    fetchParticipants();
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
     
      bg="gray.800"
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        
        <Text color={'white'} fontWeight="bold">Chats</Text>


        <Input type='text' placeholder='Search Chat' color={'white'} onChange={(e)=> setSearchChat(e.target.value)} />


        {combinedList && combinedList.length > 0 ? (
          combinedList.filter((item)=> 
            item.name.toLowerCase().includes(searchChat.toLowerCase())

          ).map((item, i) => (
            <Box
            _active={{bg:'gray.500'}}
              key={item._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              
              bg="gray.200"
              borderRadius="md"
              onClick={() => handleSideBarClick(item._id, item.name, item, item.imageUrl)}
            >
              <Avatar mr={3} src={`${import.meta.env.VITE_BACK_END_URL}${item.imageUrl}`|| item.imageUrl} />
              <Text  >{item.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )}

        {/* {combinedList && combinedList.length > 0 ? (
          combinedList.map((item, i) => (
            <Box
            _active={{bg:'gray.500'}}
              key={item._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              bg="gray.200"
              borderRadius="md"
              onClick={() => handleSideBarClick(item._id, item.name, item)}
            >
              <Text>{item.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )} */}
      </VStack>
    </Box>
  );
}