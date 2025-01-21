import React, { useEffect, useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Icon, Flex, Heading, Text, Button, Avatar } from "@chakra-ui/react";
import { LuFolder, LuUser } from "react-icons/lu";
import OwnerDash from '../DashboardComp.jsx/OwnerDash';
import UserDash from '../DashboardComp.jsx/UserDash';
import { Link } from 'react-router-dom';
import { getUser } from '../../Api/DashboardAPI';
import { useDasboardHook } from '../../hooks/DashboardUserContext';
import {Settings} from 'lucide-react'
export default function Dashboard() {
  const [username, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [userResponse, setUserResponse] = useState(null);
  const [avatar,setAvatar] = useState('');
  const {user,dispatch} = useDasboardHook();
  

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await getUser();
        console.log("resUSER", response)
        setUserName(response.data.user.name);
        setAvatar(`${import.meta.env.VITE_BACK_END_URL}${response.data.user.imageUrl}`);
        setUserEmail(response.data.user.email);
        setUserResponse(response); // Store full response if needed
        console.log("Response is:", response);
        dispatch({type:'GET_USER',payload:response.data.user})
      } catch (err) {
        console.log(err);
      }
    };

    getUserDetail();
  }, []);

  return (
    <Box>
      <Flex px={'50px'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Avatar size={'lg'} src={avatar}/>
          <Heading fontSize={'24px'}>{username}</Heading>
          
        </Flex>

        {/* Pass the actual userResponse object to the Account Settings page */}
        <Button as={Link} to={`/acc`} bg={'white'} border={'1px solid black'} >
        <Settings style={{marginRight:'5px'}} />
          Account Setting
        </Button>
      </Flex>

      <Tabs mt={4} colorScheme="teal" defaultIndex={0}>
        <TabList bg="whiteAlpha.800"  rounded="lg">
          <Tab  border={'none'}>
            <Icon as={LuUser} mr="2" />
            My Listing
          </Tab>
          <Tab border={'none'}>
            <Icon as={LuFolder} mr="2" />
            Rental Listing
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <OwnerDash />
          </TabPanel>
          <TabPanel>
            <UserDash />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
