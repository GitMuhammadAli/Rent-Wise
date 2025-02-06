import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { User, login as apiLogin, logout } from "../Api/api";
import decodeToken from "../utils/jwt";
import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");


  // const fetchUserData = async () => {
  //   try {
  //     const token = Cookies.get("jwt");
  //     if (token) {
  //       const decodedToken = decodeToken(token);
  //       if (decodedToken) {
  //         const response = await User();
  //         const userData = response.data?.user;
  //         if (userData) {
  //           setUser(userData);
  //           setStatus("authenticated");
  //         } else {
  //           setStatus("unauthenticated");
  //         }
  //       } else {
  //         setStatus("unauthenticated");
  //       }
  //     } else {
  //       setStatus("unauthenticated");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     setStatus("unauthenticated");
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  // const syncTokenWithLocalStorage = () => {
  //   const tokenFromCookie = Cookies.get("jwt");
  //   const tokenFromLocalStorage = localStorage.getItem("jwt");

  //   if (tokenFromCookie && tokenFromLocalStorage !== tokenFromCookie) {
  //     localStorage.setItem("jwt", tokenFromCookie);
  //   } else if (tokenFromLocalStorage && !tokenFromCookie) {
  //     Cookies.set("jwt", tokenFromLocalStorage, { expires: 7 });
  //   }
  // };


  const fetchUserData = async () => {
    try {
      const response = await User();
      // console.log("Response:", response);
      const userData = response.data?.user;

      if (userData) {
        setUser(userData);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

    useEffect(() => {
      if (user?._id) {
          // socket.emit("join-user", user._id.toString());
          console.log("User joined personal room:", user._id);
      }
  }, [user]);
  
  

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.status === 200) {
        await fetchUserData();
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };


  // const handleLogout = async () => {    commented by huzaifa
  //   await logout();

  //   Cookies.remove("jwt");
  //   setUser(null);
  //   setStatus("unauthenticated");
  //   naviagte('/')
  // };

   const handleLogout = async () => {    
    setUser(null)
    setStatus("unauthenticated");
  };

  console.log("AuthContext:", { user, status });

  return (
    <AuthContext.Provider
      value={{ user, status, login, fetchUserData, handleLogout }} // handleLogout
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
