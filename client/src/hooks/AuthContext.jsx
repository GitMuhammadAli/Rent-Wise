import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { User, login as apiLogin, logout } from "../Api/api";
import decodeToken from "../utils/jwt";
import { useNavigate } from "react-router-dom";




const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [token, setToken] = useState("");
  

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


  const fetchUserData = async (userToken) => {
    try {
      console.log(userToken)
      const response = await User(userToken);
      console.log("Response:", response);
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
    const userToken = JSON.parse(localStorage.getItem('user'))
    if(!userToken)
    {
      console.log("token required")  
      setStatus("unauthenticated");
      return
    }
    setToken(userToken)

   
    fetchUserData(userToken);
  }, []);


  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.status === 200) {
        const newToken = response.data?.token;
        localStorage.setItem("user", JSON.stringify(newToken)); 
        setToken(newToken); 
        await fetchUserData(newToken);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleLogout = async () => {
  
    await logout();

    //Cookies.remove("jwt");
    setUser(null);
    setStatus("unauthenticated");
    setToken(null);
    localStorage.removeItem('user')
    navigateTo('/auth/SignUp')
  };

  console.log("AuthContext:", { user, status });

  return (
    <AuthContext.Provider
      value={{ user, status, token, handleLogout, login, fetchUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
