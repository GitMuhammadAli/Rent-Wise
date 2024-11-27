import React from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'

export default function MainChat() {
  return (
    <div>
        <Flex>
        <SideChat/>
        <LiveChat/>
        </Flex>
        
      
    </div>
  )
}
