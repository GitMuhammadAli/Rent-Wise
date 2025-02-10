import { createContext, useState, useEffect } from "react";
import { getNotifications } from "../Api/Notification";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Fetch existing notifications from backend on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                console.log("Fetched notifications:", response.data.data);
                setNotifications(response?.data?.data || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    // Fix: Ensure only one event listener is added
    useEffect(() => {
        const handlePushMessage = (event) => {
          console.log("New push notification received:", event.data);
    
          setNotifications((prev) => {
            // Avoid duplicate notifications based on _id
            const exists = prev.some((notif) => notif._id === event.data._id);
    
            if (!exists) {
              return [event.data, ...prev]; // Add the new notification to the beginning of the list
            }
    
            return prev; // Return the previous state if the notification already exists
          });
        };
    
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.removeEventListener("message", handlePushMessage); // Remove any existing listeners
          navigator.serviceWorker.addEventListener("message", handlePushMessage);
        }
    
        return () => {
          navigator.serviceWorker.removeEventListener("message", handlePushMessage); 
        };
      }, []);
    

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
