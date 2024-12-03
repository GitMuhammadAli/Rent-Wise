import React from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
export default function MainChat() {
  const location = useLocation();
  const { ownerIdDetails, listingIdDetails, userIdDetails } = location.state || {};

  console.log("Owner",ownerIdDetails);
  console.log("useer",userIdDetails);
  console.log("listingggg",listingIdDetails);

  return (
    <div>
        <Flex>
        <SideChat/>
        <LiveChat/>
        </Flex>
    </div>
  )
}
