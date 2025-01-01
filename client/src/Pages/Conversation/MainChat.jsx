import React , { useEffect, useRef, useState } from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import {useLocation } from 'react-router-dom';
import { createOrGetConversation } from '../../Api/Chats'

export default function MainChat() {
const location = useLocation();
const scrollRef = useRef(null);
const { ownerIdDetails, listingIdDetails, userIdDetails } = location.state || {};
const [owner,setOwner] = useState('');
// const [listing,setListing] = useState('');
const [item , setItem] = useState('');
const [convoID, setConvoId] = useState('');
const [Messages, setMessages] = useState([]);

const [listings, setListings] = useState([]);
const [allData, setAllData] = useState(null);

useEffect(()=>{
  console.log("Owner",ownerIdDetails);
  console.log("useer",userIdDetails);
  console.log("listingggg",listingIdDetails);

  console.log("item",item);
  console.log("allData",allData);

  
},[ownerIdDetails,userIdDetails,listingIdDetails,item,allData])


useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }
}, [Messages]);


const handleSideBarClick = (receiver_id, receiver_name,  selectedParticipant,  receiver_imageUrl ) => {
  console.log("selected participant", selectedParticipant);
  console.log("receiver_id", receiver_id);

  // Update owner state with the selected participant
  setOwner({ _id: receiver_id, name: receiver_name, imageUrl: receiver_imageUrl });

  // Filter data to find the relevant conversation for the selected participant
  const filteredData = allData.find(item =>
    item.participants.some(participant => participant._id === receiver_id)
  );

  // Extract the specific listings for this participant
  const specificListings = filteredData?.listing || [];
  console.log("Listings for this participant:", specificListings);

  if(!allData) return
  const ConvoID = filteredData?._id || [];
  console.log("all data convoID", ConvoID)
  setConvoId(ConvoID)

  // Update the state
  setItem(selectedParticipant);
  setListings(specificListings); // Set the specific listings
  setMessages([]); // Clear messages for the new conversation

};


useEffect(()=>{
    const createConversation = async () => {
      try {
        await createOrGetConversation({
          receiver: ownerIdDetails._id,
          listing: listingIdDetails._id || listingIdDetails,
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
        <Flex >
        <SideChat  listings={listings} allData={allData} setAllData={setAllData} setListings={setListings} handleSideBarClick={handleSideBarClick} ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
        <LiveChat scrollRef={scrollRef} convoID={convoID} setConvoId={setConvoId} Messages={Messages} setMessages={setMessages} owner={owner} ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} listings={listings} item={item} />
        </Flex>
    </div>
)
}