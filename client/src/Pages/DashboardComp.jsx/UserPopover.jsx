

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
    const [participantsName , setParticipantsName] = useState([]); 
    const navigate = useNavigate();
    


    const showAggrement =(p)=>{
        navigate('/agreement', { state: { tentantDetail: p} });
        
    }

  
  

        const fetchNameOfChatParticipants = async()=>{

            try{
                const response = await fetchConversationsForSidebar();
                console.log("response", response);
                const data = response.data.data.map((d)=>{
                   return d.participants.map((p)=>{
                        return p
                    })
                })
                console.log("names are", data)
                setParticipantsName(data);
                
    
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
      {
  participantsName && participantsName.length > 0 &&
  participantsName.map((group, groupIndex) => (
    group.map((p, pIndex) => (
      <Flex justifyContent={'space-between'} key={pIndex}>
        <Text mb={3} fontWeight={'semibold'}>
          {p.name}
        </Text>
        <SquareMousePointer  onClick={()=> showAggrement(p)} size={20} color="#ff0000" />
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
