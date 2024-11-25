import React, { useEffect, useState } from 'react'
import SideChat from './SideChat'
import LiveChat from './LiveChat'
import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';

export default function MainChat() {
    const [activeIndex, setActiveIndex] = useState(null); 
    const [userDetails, setUserDetails] = useState({
        name: '',
        message: '',
        avatar: ''

    })
    const location = useLocation();
    const { ownerId, listingId, userId } = location.state || {};
        

    useEffect(()=>{
      console.log("Owner",ownerId);
      console.log("useer",userId);
      console.log("listingggg",listingId);
    },[ownerId,userId,listingId])

    
    const handleClick = (index,user) => {
      setActiveIndex(index); 
      console.log("user issss", user)
      if(user)
      {
        setUserDetails({
            name:user.name,
            status:user.status,
            avatar:user.avatar
    
          })
      }
    };

    const users = [
        { id: 1, name: 'Huzaifa', message: 'Latest message 1', avatar: 'https://i.pravatar.cc/300?u=iu1',status:'online' },
        { id: 2, name: 'Ali ', message: 'Latest message 2', avatar: 'https://i.pravatar.cc/300?u=iu2', status:'offline' },
        { id: 3, name: 'John Banega Don', message: 'Latest message 3', avatar: 'https://i.pravatar.cc/300?u=iu3', status:'online' },
        { id: 4, name: 'Sarah Lee', message: 'I\'m heading to the store.', avatar: 'https://i.pravatar.cc/300?u=4', status: 'offline' },
        { id: 5, name: 'Michael Turner', message: 'Don\'t forget the report.', avatar: 'https://i.pravatar.cc/300?u=5', status: 'online' },
        { id: 6, name: 'Jessica Brown', message: 'What time is the event?', avatar: 'https://i.pravatar.cc/300?u=6', status: 'offline' },
        { id: 7, name: 'Chris Davis', message: 'Let me know if you need help.', avatar: 'https://i.pravatar.cc/300?u=7', status: 'online' },
        { id: 8, name: 'Emma White', message: 'I\'ll be there in 5.', avatar: 'https://i.pravatar.cc/300?u=8', status: 'offline' },
        { id: 9, name: 'James Black', message: 'Looking forward to the weekend!', avatar: 'https://i.pravatar.cc/300?u=9', status: 'online' },
        { id: 10, name: 'Olivia Green', message: 'Let\'s grab lunch tomorrow.', avatar: 'https://i.pravatar.cc/300?u=10', status: 'offline' },
      ];
  return (
    <div>
        <Flex justifyContent={'center'} maxH={'70vh'} h={'70vh'}>
        <SideChat users={users} activeIndex={activeIndex} handleClick={handleClick} />
        <LiveChat users={users}  userDetails={userDetails} />
        </Flex>
       
      
    </div>
  )
}
