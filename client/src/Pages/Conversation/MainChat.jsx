import React, { useEffect, useRef, useState } from "react";
import SideChat from "./SideChat";
import LiveChat from "./LiveChat";
import { Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
// import { useSocketConnection } from "../../hooks/useSocketConnection";

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export default function MainChat() {
  const { user } = useAuth();
  const location = useLocation();
  const scrollRef = useRef(null);
  const { ownerIdDetails, listingIdDetails, userIdDetails } =
    location.state || {};
  const [owner, setOwner] = useState(null);
  const [item, setItem] = useState("");
  const [convoID, setConvoId] = useState("");
  const [Messages, setMessages] = useState([]);
  const [showPopOver, setShowPopOver] = useState(false);
  const [listings, setListings] = useState([]);
  const [allData, setAllData] = useState(null);
  const [isCLicked, setIsCLicked] = useState(false) // check if side bar is clicked

  // const socket = useSocketConnection(setAllData);
  // useEffect(() => {
  //   console.log("Owner", ownerIdDetails);
  //   console.log("useer", userIdDetails);
  //   console.log("listingggg", listingIdDetails);

  //   console.log("item", item);
  //   console.log("allData", allData);
  // }, [ownerIdDetails, userIdDetails, listingIdDetails, item, allData]);

  useEffect(() => {
    if (user?._id) {
      // this one is for real time Conversation shown
      socket.emit("join-user", user._id);
    }


    console.log("Current allData:", allData);
      // this one is for real time Conversation shown
    socket.on("newConversation", (data) => {
      console.log("MainChat received new conversation:", data);
      setAllData((prevData) => {
        if (!prevData) return [data];
        const exists = prevData.some(
          (conv) => conv._id === data.conversation._id
        );
        if (!exists) {
          return [...prevData, data];
        }
        return prevData;
      });
    });
    console.log("main chat data after is ", allData);

    return () => socket.off("newConversation");
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [Messages]);

  const handleSideBarClick = (
    receiver_id,
    receiver_name,
    selectedParticipant,
    receiver_imageUrl
  ) => {
    setIsCLicked(true);
    setShowPopOver(true);
    console.log("selected participant", selectedParticipant);
    console.log("receiver_id", receiver_id);

    // Update owner state with the selected participant
    setOwner({
      _id: receiver_id,
      name: receiver_name,
      imageUrl: receiver_imageUrl,
    });

    // Filter data to find the relevant conversation for the selected participant
    const filteredData = allData.find((item) =>
      item.participants.some((participant) => participant._id === receiver_id)
    );
    console.log("fiiltered", filteredData);
    

    // Extract the specific listings for this participant
    const specificListings = filteredData?.listing || [];
    console.log("Listings for this participant:", specificListings);

    if (!allData) return;
    const ConvoID = filteredData?._id || filteredData?.conversation._id ||[];
    console.log("all data convoID", ConvoID);
    setConvoId(ConvoID);

    // Update the state
    setItem(selectedParticipant);
    setListings(specificListings); // Set the specific listings
    setMessages([]); // Clear messages for the new conversation
  };

  return (
    <div>
     <div className="flex h-screen bg-gray-100">
        <SideChat
          listings={listings}
          allData={allData}
          setAllData={setAllData}
          setListings={setListings}
          handleSideBarClick={handleSideBarClick}
          owner={owner}
          setOwner={setOwner}
          ownerIdDetails={ownerIdDetails}
          userIdDetails={userIdDetails}
          listingIdDetails={listingIdDetails}
        />
        <LiveChat
          isCLicked={isCLicked}
          setIsCLicked={setIsCLicked}
          showPopOver={showPopOver}
          scrollRef={scrollRef}
          convoID={convoID}
          setConvoId={setConvoId}
          Messages={Messages}
          setMessages={setMessages}
          owner={owner}
          ownerIdDetails={ownerIdDetails}
          userIdDetails={userIdDetails}
          listingIdDetails={listingIdDetails}
          listings={listings}
          item={item}
        />
      </div>
    </div>
  );
}
