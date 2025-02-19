import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { logout } from "../Api/api";
import { useAuth}  from '../hooks/AuthContext'
import { useDasboardHook } from "../hooks/DashboardUserContext";

export default function Logout() {
    const { handleLogout } = useAuth();
    const { dispatch } =  useDasboardHook();
    const navigate = useNavigate();
    
    const LogoutUser = async()=>{

        console.log("here in logout")
        dispatch({type: 'LOGOUT_USER'})
        console.log('logged out')
        await logout();
        
        
        Cookies.remove("jwt");


        handleLogout()
        navigate('/')
    }
  return {LogoutUser};
}

