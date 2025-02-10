import React, { useContext, useEffect, useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import { Box, Flex, Text, Button, Container, useColorModeValue, Icon, VStack, Avatar, Menu, MenuButton, MenuList, MenuGroup, MenuItem, MenuDivider, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, MenuIcon } from "@chakra-ui/react"
import { FaUser,FaBell, FaComments, FaList, FaTachometerAlt, FaPlus, FaFileContract, FaSignOutAlt } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import {LogOut} from 'lucide-react'
import Logout from '../components/Logout'
import Notification from "../Pages/Notifications/Notification"
import { getNotifications } from "../Api/Notification"





function MainLayout() {
  const { user } = useAuth() // handleLogout
  const location = useLocation()
  const navigate = useNavigate()
  const {LogoutUser} = Logout()
  const [successMessage, setSuccessMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const bgColor = useColorModeValue("orange.300", "orange.600")
  const bgColor = useColorModeValue(
    "linear(to-r, #cfb27b, #eedfbf)",  // Light mode gradient
    "linear(to-r, orange.600, red.500)"   // Dark mode gradient
  );
  
  const hoverBgColor = useColorModeValue("orange.600", "orange.800")
  const textColor = useColorModeValue("white", "gray.100")
  const buttonTextColor = useColorModeValue("gray.100", "orange.300")
  const buttonHoverBgColor = useColorModeValue("gray.800", "gray.600")
  const nonHomeLinkColor = useColorModeValue("gray.800", "gray.600")
  const textHoverHome = useColorModeValue("white", "gray.100")                            // only for landing page
  const hoverBottomLinkHome = useColorModeValue("3px solid white","3px solid gray.100")   // only for landing page

  
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])


  // fetching noification
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
  
        console.log("notifications", response.data.data);
        setNotificationData(response?.data?.data);
      } catch (error) {

      }}
      fetchNotifications()
       
  }, [])

  useEffect(()=>{
    console.log('user', user)

  },[user])
  return (
    <Flex direction="column" minH="100vh">
      <ToastContainer />

      {/* bgGradient={bgColor} */}
      <Box color={textColor} boxShadow="lg" bg={location.pathname==='/' ? 'none': 'white'}
       px={10} bgGradient={location.pathname==='/' ? bgColor : 'none'}
       borderBottom={location.pathname === '/' ? 'none': '1px solid rgb(223, 221, 221)'}
       >
  <Container maxW="container.xl" py={4}>
    <Flex justifyContent="space-between" alignItems="center">
      {/* Left side: Title and Nav Items */}

      <Flex alignItems="center">
        <Text
          as={Link}
          color={location.pathname=== '/' ? "white" : "orange.400" }
          to="/"
          fontSize="2xl"
          fontFamily="'Playwrite CU', cursive"
          fontWeight="bold"
          _hover={{ color: location.pathname=== '/' ? 'none' :"orange.600" }}
        >
          RentWise
        </Text>
        {/* display={{ base: 'none', md: 'flex' }} */}
        <Flex pl={10} alignItems="center" gap={8} >
          {user ? (
            <>
              <Text
                as={Link}
                to="/chat"
                
                color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                borderBottom={location.pathname === "/chat" ? "3px solid orange" : "none"}
                fontWeight="semibold"
                leftIcon={<Icon as={FaComments} />}
              >
                Chats
              </Text>

              <Text
                as={Link}
                to="/dashboard"
                color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                borderBottom={location.pathname === "/dashboard" ? "3px solid orange" : "none"}
                fontWeight="semibold"
                leftIcon={<Icon as={FaTachometerAlt} />}
              >
                Dashboard
              </Text>
              <Text
                as={Link}
                to="/media"
             
                color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                borderBottom={location.pathname === "/media" ? "3px solid orange" : "none"}
                _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                fontWeight="semibold"
                leftIcon={<Icon as={FaPlus} />}
              >
                Create Listing
              </Text>

              {user?._id === "670ba87a096754e9bda6658f" && (
                <Button
                  as={Link}
                  to="/agreements-protected"
                 
                  color={location.pathname !== "/" ? nonHomeLinkColor : buttonTextColor}
                  _hover={{ color: location.pathname==='/' ? textHoverHome : buttonHoverBgColor, borderBottom: location.pathname=== '/' ? hoverBottomLinkHome : "3px solid orange" }}
                  fontWeight="semibold"
                  leftIcon={<Icon as={FaFileContract} />}
                >
                  View Agreements
                </Button>
              )}
            </>
          ) : (
           <Text></Text>
          )}
        </Flex>
      </Flex>

      {/* Right side: Notification and Profile Menu */}
      <Flex alignItems="center" gap={5}>
        {user ?  (
          <>

              <Notification />
            
            <Menu>
              <MenuButton>
                <Avatar size="md" src={`${import.meta.env.VITE_BACK_END_URL}${user.imageUrl}`} />
              </MenuButton>
              <MenuList color="gray.700">
                <MenuGroup title="Profile">
                  <MenuItem as={Link} to="/acc">
                    <FaUser size={20} />
                    <span style={{ marginLeft: "10px" }}>My Account</span>
                  </MenuItem>
                  <MenuItem onClick={() => LogoutUser()}>
                    <LogOut size={20} />
                    <span style={{ marginLeft: "10px" }}>Logout</span>
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Button
          as={Link}
          to="/auth/signIn"
          color={location.pathname === '/' ? buttonHoverBgColor : buttonHoverBgColor}
          _hover={{ color: buttonHoverBgColor, borderBottom: "3px solid orange" }}
          fontWeight="semibold"
          borderRadius="full"
        >
          Login
        </Button>

        )}
      </Flex>

      {/* <IconButton
           bg={'brown'}
            aria-label="Open Menu"
            icon={<MenuIcon/>}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          /> */}

          
           <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menu</DrawerHeader>
              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Text as={Link} to="/" onClick={onClose} color="gray.600" _hover={{ color: 'blue.600' }}>
                    Home
                  </Text>
                  <Text as={Link} to="/destinations" onClick={onClose} color="gray.600" _hover={{ color: 'blue.600' }}>
                    Destinations
                  </Text>
                  <Text as={Link} to="/services" onClick={onClose} color="gray.600" _hover={{ color: 'blue.600' }}>
                    Services
                  </Text>
                  <Text as={Link} to="/contact" onClick={onClose} color="gray.600" _hover={{ color: 'blue.600' }}>
                    Contact
                  </Text>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>


    </Flex>
  </Container>
</Box>


      <Flex as="main" flexGrow={1} bg={"whiteAlpha.500"}>
      {/* useColorModeValue("orange.50", "gray.900") */}
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>

     
    </Flex>
  )
}

export default MainLayout

