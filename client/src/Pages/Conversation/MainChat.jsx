import React , { useEffect } from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { createOrGetConversation } from '../../Api/Chats'

export default function MainChat() {
const location = useLocation();
const { ownerIdDetails, listingIdDetails, userIdDetails } = location.state || {};
useEffect(()=>{
  console.log("Owner",ownerIdDetails);
  console.log("useer",userIdDetails);
  console.log("listingggg",listingIdDetails);
},[ownerIdDetails,userIdDetails,listingIdDetails])

useEffect(()=>{
    const createConversation = async () => {
      try {
        await createOrGetConversation({
          receiver: ownerIdDetails._id,
          listing: listingIdDetails._id
        });
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    };

    if (ownerIdDetails && userIdDetails && listingIdDetails) {
      createConversation();
    }
},[ownerIdDetails,userIdDetails,listingIdDetails])

return (
    <div>
        <Flex>
        <SideChat ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
        <LiveChat ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
        </Flex>
    </div>
)
}