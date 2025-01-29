import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { Printer, SquareMousePointer } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { fetchConversationsForSidebar } from "../../Api/Chats";
import AgreementTemplate from "../Agreement/AgreementTemplate";
import { useNavigate } from "react-router-dom";
import { ListingsContext } from "../../hooks/ListingsContext";

export default function UserPopover({tenant,convoID}) {
  // const [participantsDetail, setParticipantsDetail] = useState([]);
   const { state } = useContext(ListingsContext);
    const { userListings } = state;


  const navigate = useNavigate();


     useEffect(()=>{
        console.log("user specific listing", userListings)
      },[userListings])


      const handleClick = (listId, list_Title, list_category)=>{
        console.log("lisrDeta", listId, list_Title, list_category)
        if(!listId || !list_Title || !list_category )
        {
          console.log("list info required")
          return;
        }
       
        navigate("/agreement", {
              state: { listId, list_Title , list_category, tenant ,convoID },
            });


      }

  // const showAggrement = (names, list, conversationID) => {
  //   console.log("name", names, "list", list, "conversationID", conversationID);
  //   navigate("/agreement", {
  //     state: { tenantName: names, tenantListing: list , conversationID: conversationID },
  //   });
  // };

 
  

  // const fetchNameOfChatParticipants = async () => {
  //   try {
  //     const response = await fetchConversationsForSidebar();
  //     console.log("response of Conversation Is", response);
      
  //     const data = response.data.data.map((d)=>{
  //        return d.participants.map((p)=>{
  //             return p
  //         })
  //     })
  //     const listing = response.data.data.map((d)=>{
  //        return d.listing.map((l)=>{
  //             return l
  //         })
  //     })
  //     console.log("names are", data)
  //     setParticipantsName(data);
  //     console.log("listing are", listing)
  //     setParticipantListings(listing)

  //     const mappedData = response.data.data.map((d) => {
  //       return {
  //         participants: d.participants.map((p) => p), // Extract participants
  //         listing: d.listing.map((l) => l), // Extract listings
  //         conversationID: d._id,
  //       };
  //     });
  //     setParticipantsDetail(mappedData);
  //     console.log("mapped", mappedData);
  //   } catch (error) {
  //     console.log("error fetching names", error);
  //   }
  // };

  return (
    <>
    
     {
      userListings.length > 0 ? (
        <Popover>
        <PopoverTrigger>
          <Flex gap={3} alignItems={"center"}>
            <Text fontWeight={"bold"} color={'orange.500'} fontSize={{base:'sm',md:"md"}}>
              Create Aggreement
            </Text>
            <Printer
            cursor={'pointer'}
              // onClick={fetchNameOfChatParticipants}
              size={40}
              color="orange"
            />
          </Flex>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader color={'black'}>Select on which listing you want to create agreement on</PopoverHeader>
          <PopoverBody>
           

            {/* {participantsDetail &&
              participantsDetail.length > 0 &&
              participantsDetail.map((group, groupIndex) =>
                group.participants.map((p, pIndex) => (
                  <Flex
                    justifyContent={"space-between"}
                    key={`participant-${groupIndex}-${pIndex}`}
                  >
                    <Text mb={3} color={'black'} fontWeight={"semibold"}>
                      {p.name || ""}
                    </Text>
                    <SquareMousePointer
                      onClick={() =>
                        showAggrement(
                          p,
                          group.listing.map((l) => l),
                          group.conversationID
                        )
                      }
                      size={20}
                      color="#ff0000"
                    />
                  </Flex>
                ))
              )} */}

            {userListings.length > 0 &&
                userListings.map((p, pIndex) => (
                  <Flex
                  onClick={()=> handleClick(p._id, p.title, p.category)}
                
                  _hover={{bg:'gray.200', p:"10px", cursor:'pointer', borderRadius:'10px'}}
                    key={ p._id || pIndex}
                  >
                    <Text width={'full'} mb={3} color={'black'} fontWeight={"semibold"}>
                      {p.title || ""}
                    </Text>
                    <SquareMousePointer
                      size={20}
                      color="#ff0000"
                    />
                  </Flex>
                ))
              }
          </PopoverBody>
        </PopoverContent>
      </Popover>

      )  : ( <Text></Text>  )
     }
        
      
      
    </>
  );
}