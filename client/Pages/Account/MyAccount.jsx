import React, { useEffect, useState } from 'react'
import { 
  Box, Button, FormControl, FormLabel, Input, Switch, Tabs, TabList, TabPanels, Tab, TabPanel, Avatar, 
  Textarea, VStack, HStack, useToast, Text 
} from '@chakra-ui/react'

import { useDasboardHook } from '../../src/hooks/DashboardUserContext';
import { getUser } from '../../src/Api/DashboardAPI';
// import { CameraIcon } from '@chakra-ui/icons'

export default function MyAccount() {
  const [avatar, setAvatar] = useState("/placeholder-avatar.jpg")
  const {user,dispatch} = useDasboardHook();
  const[username,setUsername] = useState('');
  const[userEmail,setUserEmail] = useState('');

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await getUser();
          console.log("User:", response.data.user);
          
          dispatch({ type: 'GET_USER', payload: response.data.user });
          setUsername(response.data.user.name);
          setUserEmail(response.data.user.email);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUser();

  }, [dispatch]);
  


  const toast = useToast()

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  function check()
  {
    console.log("username to display:", username)
    console.log("useremail to display:", userEmail)
  }
  

  return (
    <Box bg={'white'} maxW="3xl" mx="auto" p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
    
     
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Account Settings</Text>
        <Text fontSize="md" color="gray.600">Manage your account settings and set email preferences.</Text>
      </Box>
      <Tabs isFitted variant="enclosed">
        <TabList bg={'gray.50'}  mb="1em">
          <Tab>Personal</Tab>
          <Tab>Notifications</Tab>
          <Tab>Privacy</Tab>
          <Tab>Security</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <HStack spacing={4}>
                <Avatar size="xl" src={avatar} />
                <Box>
                  <FormLabel htmlFor="avatar-upload" cursor="pointer" display="flex" alignItems="center">
                    {/* <CameraIcon mr={2} /> */}
                     Change Avatar
                  </FormLabel>
                  <Input id="avatar-upload" type="file" accept="image/*" display="none" onChange={handleAvatarChange} />
                </Box>
              </HStack>
              <FormControl>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <Input value={username} onChange={(e)=> setUsername(e.target.value)} id="name" placeholder="Enter your full name" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input value={userEmail} onChange={(e)=> setUserEmail(e.target.value)} id="email" type="email" placeholder="Enter your email" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <Textarea id="bio" placeholder="Tell us about yourself" />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Email Notifications</FormLabel>
                <Switch />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Marketing Emails</FormLabel>
                <Switch />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Social Notifications</FormLabel>
                <Switch />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Profile Visibility</FormLabel>
                <Input as="select" placeholder="Select visibility">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </Input>
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Activity Visibility</FormLabel>
                <Switch />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Search Engine Visibility</FormLabel>
                <Switch />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input type="password" />
              </FormControl>
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <FormLabel>Two-Factor Authentication</FormLabel>
                <Switch />
              </FormControl>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <HStack justifyContent="space-between" mt={6}>
        <Button variant="outline">Cancel</Button>
        <Button colorScheme="blue" onClick={check}>Save Changes</Button>
      </HStack>
    </Box>
  )
}
