import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Box,
    Button,
    Flex,
    Text,
    useDisclosure,
  } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaBell, FaHome, FaComments, FaEllipsisH, FaCheck, FaTrash } from 'react-icons/fa'
import { clearAllNotifications, readAllNotifications, readOneNotification } from '../../Api/Notification';

// Static data for demonstration
// const initialNotifications = [
//   { id: '1', type: 'listing', message: 'Your listing "Beachfront Villa" has a new booking request.', isRead: false, timestamp: '2023-06-20T10:30:00Z' },
//   { id: '2', type: 'chat', message: 'New message from Alice regarding your apartment.', isRead: false, timestamp: '2023-06-20T11:15:00Z' },
//   { id: '3', type: 'other', message: 'Your account has been successfully verified.', isRead: true, timestamp: '2023-06-19T09:00:00Z' },
//   { id: '4', type: 'listing', message: 'Your listing "City Loft" has been approved.', isRead: false, timestamp: '2023-06-18T14:45:00Z' },
//   { id: '5', type: 'chat', message: 'Bob replied to your question about check-in time.', isRead: true, timestamp: '2023-06-17T16:30:00Z' },
// ]

export default function Notification({notificationData, setNotificationData }) {
  // const [notificationData, setNotificationData] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState('all')
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  const filterNotifications = (type) => {
    if (type === 'all') {
      return notificationData; 
    }
  
    // Filter notifications that match the specified type
    const filtered = notificationData.filter(n => n.type === type);
  
    // If no notifications match the type, return notifications with 'other' type
    // if (filtered.length === 0) {
    //   return notificationData.map(n => {
    //     if(n.type !== type)
    //     {
    //       return {...n, type:'other'}
    //     }
    //     return n;

    //   }); 
    // }
  
    return filtered;
  };

  const markAllAsRead = async() => {
    try {

    setNotificationData(notificationData.map(n => ({ ...n, isRead: true })))
    const response = await readAllNotifications()
    console.log("responseOFReadALl", response)

    } catch (error) {
      console.log(error);
      
    }
    
  }

  const clearAll = async() => {

    try {
      setNotificationData([])
      const response = await clearAllNotifications();
      console.log('cleared', response)
      
    } catch (error) {
      console.log(error)
      
    }
  }

 

  const deleteRead = () => {
    setNotificationData(notificationData.filter(n => !n.isRead))
  }

  const toggleRead =async (id) => {
    try {
      setNotificationData(notificationData.map(n => 
        n._id === id ? { ...n, isRead: !n.isRead } : n ))
  
       const response = await readOneNotification(id);
       console.log('readedONe', response);
      
    } catch (error) {
      console.log(error);
      
    }
   
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const togglePopover = () => {
    isOpen ? onClose() : onOpen();
  };

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose} >
      <PopoverTrigger>
      <Box as="span" cursor="pointer" onClick={togglePopover}>
          <FaBell className="h-6 w-6 text-gray-700" />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton color="teal" />
        <PopoverHeader color="black">Notifications</PopoverHeader>
        <PopoverBody>
          <Box>
            {/* Tabs Header */}
            <Flex borderBottom="1px" borderColor="gray.200">
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'all' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'all' ? '2px solid' : 'none'}
    borderColor={activeTab === 'all' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('all')}
  >
    All
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'review' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'review' ? '2px solid' : 'none'}
    borderColor={activeTab === 'review' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('review')}
  >
    Reviews
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'comment' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'comment' ? '2px solid' : 'none'}
    borderColor={activeTab === 'comment' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('comment')}
  >
    Comments
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'other' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'other' ? '2px solid' : 'none'}
    borderColor={activeTab === 'other' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('other')}
  >
    Other
  </Button>
</Flex>

  
            {/* notificationData List */}
            <Box maxH="80" overflowY="auto">
              {filterNotifications(activeTab).map((notification) => (
                <Box
                  key={notification._id}
                  p={4}
                  borderBottom="1px"
                  borderColor="gray.200"
                  bg={notification.isRead ? 'gray.50' : 'white'}
                >
                  <Flex alignItems="start">
                    <Box flexShrink={0} mt={1}>
                      {notification.type === 'review' && <FaHome color="blue" />}
                      {notification.type === 'comment' && <FaComments color="green" />}
                      {notification.type === 'other' && <FaEllipsisH color="purple" />}
                    </Box>
                    <Box ml={3} flex="1">
                      <Text fontSize="sm" color={notification.isRead ? 'gray.500' : 'gray.900'}>
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {formatTimestamp(notification.createdAt)}
                      </Text>
                    </Box>
                    <Button
                      onClick={() => toggleRead(notification._id)}
                      variant="ghost"
                      ml={2}
                      color="gray.400"
                      _hover={{ color: 'gray.600' }}
                    >
                      <FaCheck color={notification.isRead ? 'green' : undefined} />
                    </Button>
                  </Flex>
                </Box>
              ))}
            </Box>
  
            {/* Footer Buttons */}
            <Flex justify="space-between" p={4} borderTop="1px" borderColor="gray.200">
              <Button
                variant="link"
                fontSize="sm"
                color="orange.500"
                _hover={{ color: 'orange.600' }}
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
              <Button
                variant="link"
                fontSize="sm"
                color="red.500"
                _hover={{ color: 'red.600' }}
                onClick={clearAll}
              >
                Clear all
              </Button>
              <Button
                variant="link"
                fontSize="sm"
                color="gray.500"
                _hover={{ color: 'gray.600' }}
                onClick={deleteRead}
              >
                Delete read
              </Button>
            </Flex>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}