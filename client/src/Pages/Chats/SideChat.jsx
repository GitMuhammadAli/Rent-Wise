import { Avatar, Box, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getSideBarParticipants } from '../../Api/Chats';

export default function SideChat({ users, handleClick, activeIndex }) {
  const [participants, setParticipants] = useState([]);

  useEffect(()=>{
    const getSideChat = async()=>{
      try {
        const response = await getSideBarParticipants();
        setParticipants(response.data.participants);
        console.log("participants", response.data.participants)
      } catch (error) {
        console.log("error getting side chat", error)
      }
    }
    getSideChat();
  },[])
  
  return (
    <div>
      <VStack bg={'white'} p={'40px 0px'} maxW={'fit-content'} h={'100%'}>
        <Input mx={'20px'} p={'20px'} bg={'white'} type='text' placeholder='Search user' />

        <Heading px={'20px'} alignSelf={'self-start'} as={'h4'} fontSize={'sm'} mb={'30px'}>
          Peoples
        </Heading>

        <Box maxH={'70vh'} overflowY={'scroll'} w={'100%'}>
          {participants.map((participant, index) => (
            <Flex
              key={participant._id}
              p={'10px'}
              w={'full'}
              alignItems={'center'}
              gap={3}
              onClick={() => handleClick(index, participant)}
              bg={activeIndex === index ? 'blue.200' : 'gray.100'}
              cursor="pointer"
            >
              <Avatar src={`${import.meta.env.VITE_BACK_END_URL}${participant.user.imageUrl}`} />              
              <Box>
                <Text fontWeight={'bold'} fontSize={'large'}>
                  {participant.user.name}
                </Text>
                <Text color={'gray.700'} fontSize={'sm'}>
                  {participant.user.email}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>
      </VStack>
    </div>
  );

}