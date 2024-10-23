import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Icon, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { LuCheckSquare, LuFolder, LuUser } from "react-icons/lu";
import OwnerDash from './DashboardComp.jsx/OwnerDash';
import UserDash from './DashboardComp.jsx/UserDash';
import { Link } from 'react-router-dom';

export default function Dashboard() {

  return (
    <Box>

        <Flex justifyContent={'space-between'}>
            <Box><Heading>My name</Heading>
            <Text>myname@gmail.com</Text></Box>

            <Button as={Link} to={'/acc'}>Account Setting</Button>
            
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
          <OwnerDash/>
          </TabPanel>

          <TabPanel>
            <UserDash/>
          
          </TabPanel>

          
        </TabPanels>
      </Tabs>
    </Box>
  );
}
