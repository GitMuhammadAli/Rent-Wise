import { useAuth } from "../hooks/AuthContext";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END_URL, {
  withCredentials: true,
});

export const useSocketConnection = () => {
    const { user } = useAuth();
    
    socket.on("connect", () => {
        if (user?._id) {
            socket.emit("join-user", user._id);
        }
    });

    // socket.on("newConversation", (data) => {
    //     setAllData(prevData => {
    //         const updated = prevData ? [...prevData] : [];
    //         updated.unshift(data);
    //         return updated;
    //     });
    // });

    return socket;
};
