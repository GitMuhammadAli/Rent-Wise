import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom'; 
import SideChat from './SideChat';
import Chats from './Chats'; 

export default function MainChatComponent({ user, currentListing, setActiveIndex }) {
  const { ownerID, listingId } = useParams(); 
  
  useEffect(() => {
    console.log('ownerID from params:', ownerID);
    console.log('listingId from params:', listingId);
  }, [ownerID, listingId]);

  return (
    <Box>
      <Box display="flex">
        <SideChat setActiveIndex={setActiveIndex} />
        <Chats 
          ownerId={ownerID}
          listingId={listingId}
        />
      </Box>
    </Box>
  );
}
