import { Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
const socket = io("http://localhost:3600");
import { io } from "socket.io-client";
import { createMessage, fetchMessagesByConversation } from "../../Api/Chats";
export default function SendToTenant() {
    const location = useLocation();
 const { mainDetails} = location.state || {};
 const [_id, set_id] = useState('')
 const [conversationID, setConversationID] = useState('')
 const [renterId, setRenterId] = useState('')
 const [listingId, setListingId] = useState('')


  useEffect(()=>{
    console.log("details in send to tenant are:" , mainDetails)
    set_id(mainDetails._id)
    setConversationID(mainDetails.conversationID);
    setRenterId(mainDetails.renterId._id)
    setListingId(mainDetails.listingId._id)

  },[mainDetails])

  const SentToRenter = async () => {
    // console.log("Agreement detail:", aggrementFromResponce);
    console.log("Joining conversation ID:", conversationID);
    socket.emit("join-conversation", conversationID);
  
    try {
        const link = `${import.meta.env.VITE_FRONT_END_URL}/agreement/${_id}`;
        const dataForSentMessageOfAgreement = {
            message: `Agreement Link: ${link}`,
            listing: [listingId], // Add appropriate listing ID(s)
            receiver: renterId, // Adjust as needed
        };
  
        console.log("Sending link as message:", dataForSentMessageOfAgreement);
  
        const response = await createMessage(dataForSentMessageOfAgreement);
        console.log("Response from message creation:", response);
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };
  
  return (
    <div>

     <Heading>Hello CHAUDHRY sahab, welcome to this component</Heading>
     <h4>Krdo socket wala kaam</h4>
     <button onClick={SentToRenter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">dubaoooo</button>
      
    </div>
  )
}


