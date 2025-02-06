import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { logout } from "../Api/api";
import { useAuth}  from '../hooks/AuthContext'

export default function Logout() {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    
    const LogoutUser = async()=>{

        console.log("here in logout")
        await logout();
        Cookies.remove("jwt");  
        handleLogout()
        navigate('/')
    }
  return {LogoutUser};
}

