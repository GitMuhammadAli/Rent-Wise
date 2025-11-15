import { useAuth } from "../hooks/AuthContext";
import { socket } from "../utils/socket";

export const useSocketConnection = () => {
    const { user } = useAuth();
    
    socket.on("connect", () => {
        // if (user?._id) {
        //     socket.emit("join-user", user._id);
        // }
    });


    return socket;
};
