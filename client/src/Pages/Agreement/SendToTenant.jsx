import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

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
  return (
    <div>

      
    </div>
  )
}


