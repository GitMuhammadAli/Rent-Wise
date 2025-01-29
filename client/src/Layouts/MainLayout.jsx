import React, { useEffect, useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import { Box, Flex, Text, Button, Container, useColorModeValue, Icon, VStack } from "@chakra-ui/react"
import { FaUser, FaComments, FaList, FaTachometerAlt, FaPlus, FaFileContract, FaSignOutAlt } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"

function MainLayout() {
  const { user, handleLogout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState("")

  // const bgColor = useColorModeValue("orange.300", "orange.600")
  const bgColor = useColorModeValue(
    "linear(to-r, orange.300, #999cba)",  // Light mode gradient
    "linear(to-r, orange.600, red.500)"   // Dark mode gradient
  );
  
  const hoverBgColor = useColorModeValue("orange.600", "orange.800")
  const textColor = useColorModeValue("white", "gray.100")
  const buttonBgColor = useColorModeValue("white", "gray.700")
  const buttonTextColor = useColorModeValue("orange.500", "orange.300")
  const buttonHoverBgColor = useColorModeValue("gray.100", "gray.600")

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      setSuccessMessage("")
    }
  }, [successMessage])

  return (
    <Flex direction="column" minH="100vh">
      <ToastContainer />

      <Box bgGradient={bgColor} color={textColor} boxShadow="md">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Text as={Link} to="/" fontSize="2xl" fontFamily= "'Playwrite CU', cursive"  fontWeight="bold" _hover={{ color: "orange.200" }}>
              RentWise
            </Text>

            <Flex align="center" spacing={4}>
              {user ? (
                <>
                  <Button
                    as={Link}
                    to="/acc"
                    bg={buttonBgColor}
                    color={buttonTextColor}
                    _hover={{ bg: buttonHoverBgColor }}
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={<Icon as={FaUser} />}
                  >
                    User
                  </Button>
                  <Button
                    as={Link}
                    to="/chat"
                    bg={buttonBgColor}
                    color={buttonTextColor}
                    _hover={{ bg: buttonHoverBgColor }}
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={<Icon as={FaComments} />}
                  >
                    Chats
                  </Button>
                  <Button
                    as={Link}
                    to="/dashboard"
                    bg={buttonBgColor}
                    color={buttonTextColor}
                    _hover={{ bg: buttonHoverBgColor }}
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={<Icon as={FaTachometerAlt} />}
                  >
                    Dashboard
                  </Button>
                  <Button
                    as={Link}
                    to="/media"
                    bg={buttonBgColor}
                    color={buttonTextColor}
                    _hover={{ bg: buttonHoverBgColor }}
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={<Icon as={FaPlus} />}
                  >
                    Create Listing
                  </Button>
                  {user?._id === "670ba87a096754e9bda6658f" && (
                    <Button
                      as={Link}
                      to="/agreements-protected"
                      bg={buttonBgColor}
                      color={buttonTextColor}
                      _hover={{ bg: buttonHoverBgColor }}
                      fontWeight="bold"
                      px={4}
                      mr={2}
                      leftIcon={<Icon as={FaFileContract} />}
                    >
                      View Agreements
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    bg="red.500"
                    _hover={{ bg: "red.600" }}
                    color="white"
                    fontWeight="bold"
                    px={4}
                    leftIcon={<Icon as={FaSignOutAlt} />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/auth/signIn"
                  bg={buttonBgColor}
                  color={buttonTextColor}
                  _hover={{ bg: buttonHoverBgColor }}
                  fontWeight="bold"
                  px={6}
                  py={2}
                  borderRadius="full"
                >
                  Login
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Flex as="main" flexGrow={1} bg={useColorModeValue("orange.50", "gray.900")}>
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>

     
    </Flex>
  )
}

export default MainLayout

