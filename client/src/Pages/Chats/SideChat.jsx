import { Avatar, Box, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
export default function SideChat() {
  const [activeIndex, setActiveIndex] = useState(null); 
  const handleClick = (index) => {
    setActiveIndex(index); 
  };
  const users = [
    { id: 1, name: 'User Name 1', message: 'Latest message 1', avatar: 'https://i.pravatar.cc/300?u=iu1' },
    { id: 2, name: 'User Name 2', message: 'Latest message 2', avatar: 'https://i.pravatar.cc/300?u=iu2' },
    { id: 3, name: 'User Name 3', message: 'Latest message 3', avatar: 'https://i.pravatar.cc/300?u=iu3' },
  ];
  return (
    <div>
      <VStack bg={'white'} p={'40px 0px'} maxW={'fit-content'}>
        <Input mx={'20px'} width={'100%'} bg={'white'} type='text' placeholder='search user' />
        <Heading px={'20px'} alignSelf={'self-start'} as={'h4'} fontSize={'sm'} mb={'30px'}>
          Peoples
        </Heading>
        {users.map((user, index) => (
          <Flex
            key={user.id}
            p={'10px'}
            w={'full'}
            alignItems={'center'}
            gap={3}
            onClick={() => handleClick(index)}
            bg={activeIndex === index ? 'blue.200' : 'gray.100'} 
            cursor="pointer"
          >
            <Avatar src={user.avatar} />
            <Box>
              <Text fontWeight={'bold'} fontSize={'large'}>
                {user.name}
              </Text>
              <Text color={'gray.400'} fontSize={'sm'}>
                {user.message}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </div>
  );
}