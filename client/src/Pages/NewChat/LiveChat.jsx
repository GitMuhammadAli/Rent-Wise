import { Box, Button, HStack, Input } from '@chakra-ui/react';
import React from 'react'

export default function LiveChat() {
    return (
        <Box
          flex="1"
          p={4}
          bg="white"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Box flex="1" height="300px" overflowY="scroll" bg="gray.50" borderRadius="md" p={4}>
            {/* Messages will appear here */}
          </Box>
          <HStack mt={4}>
            <Input
              placeholder="Type your message..."
              border="none"
              bg="gray.100"
              borderRadius="md"
              _focus={{ boxShadow: "outline" }}
            />
            <Button colorScheme="blue">Send</Button>
          </HStack>
        </Box>
      );
}
