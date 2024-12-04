import React , { useEffect, useState } from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import {useLocation } from 'react-router-dom';
// import { createOrGetConversation } from '../../Api/Chats'

export default function MainChat() {
const location = useLocation();
const { ownerIdDetails, listingIdDetails, userIdDetails } = location.state || {};
const [owner,setOwner] = useState('');
const [listing,setListing] = useState('');
const [item , setItem] = useState('');
const [allData , setAllData] = useState('');
const [Messages, setMessages] = useState([]);

useEffect(()=>{
  console.log("Owner",ownerIdDetails);
  console.log("useer",userIdDetails);
  console.log("listingggg",listingIdDetails);
  console.log("item",item);
  console.log("allData",allData);
},[ownerIdDetails,userIdDetails,listingIdDetails,item,allData])


const handleSideBarClick = (receiver_id, receiver_name , item ,   listings, allData)=>{
  // setOwner([{_id:ownerIdDetails._id, name:ownerIdDetails.name}] );
  setOwner({_id:receiver_id, name:receiver_name} );
  setItem(item);
  setListing(listings);
  setAllData(allData);

  setMessages([])

}

// useEffect(()=>{
//     const createConversation = async () => {
//       try {
//         await createOrGetConversation({
//           receiver: ownerIdDetails._id,
//           listing: listingIdDetails._id
//         });
//       } catch (error) {
//         console.error("Error creating conversation:", error);
//       }
//     };

//     if (ownerIdDetails && userIdDetails && listingIdDetails) {
//       createConversation();
//     }
// },[ownerIdDetails,userIdDetails,listingIdDetails])

return (
    <div>
        <Flex>
        <SideChat handleSideBarClick={handleSideBarClick} ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} />
        <LiveChat Messages={Messages} setMessages={setMessages} owner={owner} ownerIdDetails={ownerIdDetails} userIdDetails={userIdDetails} listingIdDetails={listingIdDetails} listing={listing} item={item} />
        </Flex>
    </div>
)
}