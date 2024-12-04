import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants , fetchConversationsForSidebar } from '../../Api/Chats';

export default function SideChat({ handleSideBarClick, ownerIdDetails, userIdDetails, listingIdDetails }) {
  const [participants, setParticipants] = useState([]);
  const [owner, setOwner] = useState(null);
  const [listings, setListings] = useState([]);
  const [allData, setAllData] = useState(null);

  // Fetch participants from the API
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetchConversationsForSidebar();
        console.log("response", response);
        const participantData = response.data.data[0].participants || [];
        const listingData = response.data.data[0].listing || [];
        console.log("Participants are: ", participantData);
        console.log("Listings are: ", listingData);
        setParticipants(participantData);
        setListings(listingData);
        setAllData(response.data.data[0]);
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
      height="100vh"
      bg="red.100"
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold">Listings:</Text>
        {listings.map((listing, i) => (
          <Box
            key={listing._id}
            p={2}
            bg="gray.300"
            borderRadius="md"
          >
            <Text>{listing.title}</Text>
          </Box>
        ))}
        
        <Text fontWeight="bold">Participants:</Text>
        {combinedList && combinedList.length > 0 ? (
          combinedList.map((item, i) => (
            <Box
              key={item._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              bg="gray.200"
              borderRadius="md"
              onClick={() => handleSideBarClick(item._id, item.name, item, listings, allData)}
            >
              <Text>{item.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )}
      </VStack>
    </Box>
  );
}