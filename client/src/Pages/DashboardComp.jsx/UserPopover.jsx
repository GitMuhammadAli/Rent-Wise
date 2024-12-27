

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
    Box
  } from '@chakra-ui/react'
import {  Printer, SquareMousePointer } from 'lucide-react'
import { useEffect, useState } from "react"
import { fetchConversationsForSidebar } from '../../Api/Chats';
import AgreementTemplate from '../Agreement/AgreementTemplate';
import { useNavigate } from 'react-router-dom';

export default function UserPopover ()  {
    const [participantsDetail , setParticipantsDetail] = useState([]); 
    
    const navigate = useNavigate();
    


    const showAggrement =(names, list)=>{
      console.log("name", names, "list", list)
        navigate('/agreement', { state: { tentantName: names, tenantListingId: list} });
        
    }

  
  

        const fetchNameOfChatParticipants = async()=>{

            try{
                const response = await fetchConversationsForSidebar();
                console.log("response of Conversation Is", response);
                // const data = response.data.data.map((d)=>{
                //    return d.participants.map((p)=>{
                //         return p
                //     })
                // })
                // const listing = response.data.data.map((d)=>{
                //    return d.listing.map((l)=>{
                //         return l
                //     })
                // })
                // console.log("names are", data)
                // setParticipantsName(data);
                // console.log("listing are", listing)
                // setParticipantListings(listing)




                const mappedData = response.data.data.map((d) => {
                  return {
                    participants: d.participants.map((p) => p), // Extract participants
                    listing: d.listing.map((l) => l), // Extract listings
                  };
                });
                setParticipantsDetail(mappedData)
                console.log("mapped", mappedData)
               
                
                
    
            }
            catch(error)
            {
                console.log("error fetching names", error)
    
            }
        
        }
  
  
  return (
    <>
    <Popover>
    <PopoverTrigger>
      
    
       <Flex gap={3} alignItems={'center'}>
              <Text fontWeight={'bold'} fontSize={'lg'} >Create Aggreement</Text>
              <Printer  onClick={ fetchNameOfChatParticipants} size={40} color="#ff0000" />
               
          </Flex>


    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Renters to create aggreement with!</PopoverHeader>
      <PopoverBody>
      {/* {
  participantsDetail && participantsDetail.length > 0 &&
  participantsDetail.map((group, groupIndex) => (
    group.participants.map((p, pIndex) => (
      <Flex justifyContent={'space-between'} key={pIndex}>
        <Text mb={3} fontWeight={'semibold'}>
          {p.name || ''}
        </Text>
        <SquareMousePointer  onClick={()=> showAggrement(p)} size={20} color="#ff0000" />
      </Flex>
    ))
  ))
} */}

{
  participantsDetail && participantsDetail.length > 0 &&
  participantsDetail.map((group, groupIndex) => (
    group.participants.map((p, pIndex) => (
      <Flex justifyContent={'space-between'} key={`participant-${groupIndex}-${pIndex}`}>
        <Text mb={3} fontWeight={'semibold'}>
          {p.name || ''}
        </Text>
        <SquareMousePointer  
          onClick={() => showAggrement(p, group.listing.map(l => l._id))} 
          size={20} 
          color="#ff0000" 
        />
      </Flex>
    ))
  ))
}


      </PopoverBody>
    </PopoverContent>
  </Popover>


 





  </>
  )
}
