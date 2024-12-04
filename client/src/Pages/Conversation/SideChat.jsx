import { Box, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants } from '../../Api/Chats';

export default function SideChat({ handleSideBarClick, ownerIdDetails, userIdDetails, listingIdDetails }) {
  const [participants, setParticipants] = useState([]);
  const [owner, setOwner] = useState(null);

  // Fetch participants from the API
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await getSideBarParticipants();
        const participantData = response?.data?.participants || [];
        console.log("Participants are: ", participantData);
        setParticipants(participantData);
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

  // Combine participants and owner (if not already in the list)
  const combinedList = React.useMemo(() => {
    if (!owner) return participants;
    const isOwnerInParticipants = participants.some((participant) => participant.user._id === owner._id);
    return isOwnerInParticipants ? participants : [{ user: owner }, ...participants];
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
        {combinedList && combinedList.length > 0 ? (
          combinedList.map((item, i) => (
            <Box
              key={item.user?._id || i}
              display="flex"
              alignItems="center"
              cursor="pointer"
              p={2}
              bg="gray.200"
              borderRadius="md"
              onClick={() => handleSideBarClick(item.user._id, item.user.name)}
            >
              <Text>{item.user.name}</Text>
            </Box>
          ))
        ) : (
          <Text>No participants available</Text>
        )}
      </VStack>
    </Box>
  );
}
