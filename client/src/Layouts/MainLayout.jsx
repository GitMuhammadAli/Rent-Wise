import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex, Text, Button, Container } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";

function MainLayout() {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  // const Admin_ID = import.meta.env.ADMIN_ID;


  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
    
  }, [location]);

// useEffect(()=>{
//   console.log("userID", user._id, "import", Admin_ID)
// },[user, Admin_ID])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage("");
    }
  }, [successMessage]);

  return (
    <Flex direction="column" minH="100vh">
      <ToastContainer />
      
      <Box bg="gray.800" color="white">
        <Container maxW="container.xl" py={2}>
          <Flex justify="space-between" align="center">
            <Text as={Link} to="/" _hover={{ color: "gray.300" }}>
              Home
            </Text>

            <Flex align="center">
              {user ? (
                <>
                  <Button
                    as={Link}
                    to="/acc"
                    bg="green.500"
                    _hover={{ bg: "green.600" }}
                    color="white"
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    User
                  </Button>
                  <Button
                    as={Link}
                    to="/chat"
                    bg="purple.500"
                    _hover={{ bg: "purple.600" }}
                    color="white"
                    fontWeight="bold"
                    px={4}
                    mr={2}
                    leftIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    Chats
                  </Button>
                  <Text as={Link} to="/getAll" _hover={{ color: "gray.300" }} mr={4}>
                    Get Listings
                  </Text>
                  <Text as={Link} to="/dashboard" _hover={{ color: "gray.300" }} mr={4}>
                    Dashboard
                  </Text>
                  <Text as={Link} to="/media" _hover={{ color: "gray.300" }} mr={4}>
                    Create lisitng
                  </Text>
                  {
            user?._id === '670ba87a096754e9bda6658f' && (  // store in .evn later on
                  <Text mr={3} cursor={'pointer'} as={Link} to="/agreements-protected" _hover={{ color: "gray.300" }}>View Agreements</Text>
                )
              }

                  <Button
                    onClick={handleLogout}
                    bg="red.500"
                    _hover={{ bg: "red.600" }}
                    color="white"
                    fontWeight="bold"
                    px={4}
                  >
                    Logout
                  </Button>
                </>
                
              ) : (
                <Button
                  as="a"
                  href="/auth/signIn"
                  bg="blue.500"
                  _hover={{ bg: "blue.600" }}
                  color="white"
                  fontWeight="bold"
                  px={4}
                >
                  Login
                </Button>
              )}
              
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Flex as="main" flexGrow={1} py={4} >
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </Flex>

      <Box bg="gray.800" color="white" py={4}>
        <Container maxW="container.xl">
          <Text textAlign="center">
            © 2023 Your Company Name. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Flex>
  );
}

export default MainLayout;
