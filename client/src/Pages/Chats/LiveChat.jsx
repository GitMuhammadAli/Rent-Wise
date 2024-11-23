import { Avatar, Box, Flex, Heading, HStack, Input, Text, Image } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { SendHorizontal } from 'lucide-react';

export default function LiveChat({ users, userDetails }) {
    const [source, setSource] = useState('');

   
    useEffect(() => {
        if (userDetails.status === 'offline') {
            setSource('/images/round.png');
        } else {
            setSource('/images/button.png');
        }
    }, [userDetails.status]); 


    return (
        <div>
            <Flex justifyContent={'space-between'} flexDir={'column'} borderLeft={'1px solid gray'} bg={'white'} w={'60vw'} h={'100%'}>
                {users && (
                    <Flex gap={4} alignItems={'center'} borderBottom={'1px solid gray'} p={'20px'}>
                        <Avatar src={userDetails.avatar} />
                        <Flex flexDir={'column'} >
                            <Text fontWeight={'bold'}>{userDetails.name}</Text>
                            <Flex alignItems={'center'} gap={1}>
                            <Image w={'8px'} h={'8px'} src={source} alt="status image" />
                            <Text fontSize={'sm'}>{userDetails.status}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                )}

                <Flex borderTop={'1px solid gray'} p={3} w={'full'} alignItems={'center'} alignSelf={'end'}>
                    <Input
                   
                        placeholder='Type your message here'
                        w={'100%'}
                        type='text'
                        bg={'white'}
                        borderRadius={'none'}
                        border={'none'}
                        _focus={{
                            boxShadow: "none",
                            borderColor: "transparent",
                        }}
                    />
                    <SendHorizontal />
                </Flex>
            </Flex>
        </div>
    );
}
