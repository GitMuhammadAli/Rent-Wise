import React from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
export default function MainChat() {
const location = useLocation();
const { ownerIdDetails, listingIdDetails, userIdDetails } = location.state || {};

return (
  <div>
      <Flex>
      <SideChat ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
      <LiveChat ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
      </Flex>
  </div>
)
}