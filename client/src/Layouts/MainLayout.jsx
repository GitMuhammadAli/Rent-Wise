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

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

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
                    to="/account-settings"
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

                  <Text as={Link} to="/getAll" _hover={{ color: "gray.300" }} mr={4}>
                    Get Listings
                  </Text>
                  <Text as={Link} to="/media" _hover={{ color: "gray.300" }} mr={4}>
                    Create lisitng
                  </Text>

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
                  href="/login"
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

      <Flex as="main" flexGrow={1} p={8}>
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
