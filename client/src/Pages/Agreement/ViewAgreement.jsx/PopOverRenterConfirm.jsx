
import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverArrow , PopoverCloseButton ,PopoverContent, PopoverHeader, PopoverBody, Button, PopoverFooter, ButtonGroup, Text, Flex } from '@chakra-ui/react';
import { ViewAggrementByRenter } from '../../../Api/Agreement';
export default function PopOverRenterConfirm({aggId,renterConfirmed, setRenterConfirmed}) {
    const [isOpen, setIsOpen] = React.useState(false)
 const open = () => setIsOpen(!isOpen)
 const close = () => setIsOpen(false)

 useEffect(()=>{
  if(!aggId)
  {
    console.log("NO aggr ID");
    return;
  }
 },[aggId])


 const saveFinalAgreemnt = async()=>{
    console.log("agreement saving")
    try{
        if(renterConfirmed && aggId)
            {
                const response  = await ViewAggrementByRenter({aggId ,renterConfirmed});
                console.log('response is view', response);
        
        
            }

    }catch(error)
    {
console.log("err in popover", error);
    }
    
 }
  return (
    <div>
         <Popover placement='top-start' isOpen={renterConfirmed} onClose={() => setRenterConfirmed(false)} closeOnBlur={false}>
           
      <PopoverTrigger  >
       <Button display={'flex'} ml={'50%'} alignSelf={'flex-end'} disabled/>
      </PopoverTrigger>
       <PopoverContent >
                <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  Do you agree on the terms and policies of this agreement?
                  <Text color={'red'}>Note: If you press yes this agreement will be created between you and owner</Text>
                </PopoverBody>
                <PopoverFooter d='flex' justifyContent='flex-end'>
                  <ButtonGroup size='sm'>
                    <Button variant='outline' onClick={() => setRenterConfirmed(false)}>No</Button>
                    <Button colorScheme='red' onClick={saveFinalAgreemnt} >Yes</Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            
    </Popover>
      
    </div>
  )
}
