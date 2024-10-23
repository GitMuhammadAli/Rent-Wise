import React, { useEffect, useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Icon, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { LuCheckSquare, LuFolder, LuUser } from "react-icons/lu";
import OwnerDash from './DashboardComp.jsx/OwnerDash';
import UserDash from './DashboardComp.jsx/UserDash';
import { Link } from 'react-router-dom';
import { getUser } from '../src/Api/DashboardAPI';
import { useDasboardHook } from '../src/hooks/DashboardUserContext';

export default function Dashboard() {
  const [username, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [userResponse, setUserResponse] = useState(null);
  const {user,dispatch} = useDasboardHook();
  

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await getUser();
        setUserName(response.data.user.name);
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
        <Box>
          <Heading>{username}</Heading>
          <Text>{useremail}</Text>
        </Box>

        {/* Pass the actual userResponse object to the Account Settings page */}
        <Button as={Link} to={'/acc'}>
          Account Setting
        </Button>
      </Flex>

      <Tabs variant="enclosed-colored" colorScheme="teal" defaultIndex={0}>
        <TabList bg="gray.100" p="1" rounded="lg">
          <Tab>
            <Icon as={LuUser} mr="2" />
            My Listing
          </Tab>
          <Tab>
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
