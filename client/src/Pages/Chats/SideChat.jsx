import { Avatar, Box, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

export default function SideChat({ users, handleClick, activeIndex }) {
  return (
    <div>
      <VStack bg={'white'} p={'40px 0px'} maxW={'fit-content'} h={'100%'}>
        <Input mx={'20px'} p={'20px'} bg={'white'} type='text' placeholder='Search user' />

        <Heading px={'20px'} alignSelf={'self-start'} as={'h4'} fontSize={'sm'} mb={'30px'}>
          Peoples
        </Heading>

      
        <Box maxH={'70vh'} overflowY={'scroll'} w={'100%'}>
          {users.map((user, index) => (
            <Flex
              key={user.id}
              p={'10px'}
              w={'full'}
              alignItems={'center'}
              gap={3}
              onClick={() => handleClick(index, user)}
              bg={activeIndex === index ? 'blue.200' : 'gray.100'}
              cursor="pointer"
            >
              <Avatar src={user.avatar} />
              <Box>
                <Text fontWeight={'bold'} fontSize={'large'}>
                  {user.name}
                </Text>
                <Text color={'gray.700'} fontSize={'sm'}>
                  {user.message}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>
      </VStack>
    </div>
  );
}
