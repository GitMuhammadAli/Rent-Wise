
// use --> useContext(NotificationContext) to access details

import { createContext, useState, useEffect } from "react";
 import { getNotifications, readAllNotifications, clearAllNotifications, readOneNotification } from "../Api/Notification";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch existing notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        console.log("Fetched notifications:", response.data.data);
        const fetchedNotifications = response?.data?.data || [];
        setNotifications(fetchedNotifications);

        // Calculate initial unread count
        const count = fetchedNotifications.filter((n) => !n.isRead).length;
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle incoming push notifications
  useEffect(() => {
    const handlePushMessage = (event) => {
      console.log("New push notification received in frontend:", event.data);
      setUnreadCount(unreadCount + 1);
      console.log("noti count",unreadCount + 1)
      setNotifications((prev) => {
        // Avoid duplicate notifications
        const exists = prev.some(
          (notif) => notif._id === event.data._id // Use `_id` instead of `title` and `message`
        );
  
        if (!exists) {
          return [event.data, ...prev]; // Add the new notification to the beginning of the list
        }
  
        return prev; // Return the previous state if the notification already exists
      });
    };
  
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log("Service Worker is ready:", registration);
        navigator.serviceWorker.removeEventListener("message", handlePushMessage); // Remove any existing listeners
        navigator.serviceWorker.addEventListener("message", handlePushMessage);
      }).catch((error) => {
        console.error("Service Worker is not ready:", error);
      });
    }
  
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handlePushMessage); // Cleanup on unmount
      }
    };
  }, []);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      const response = await readAllNotifications();
      console.log("responseOFReadALl", response);
    } catch (error) {
      console.log(error);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      const response = await clearAllNotifications();
      console.log("cleared", response);
    } catch (error) {
      console.log(error);
    }
  };

  // Delete all read notifications
  const deleteRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  // Toggle read status of a notification
  const toggleRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      // Update unread count
      setUnreadCount((prevCount) => {
        const notification = notifications.find((n) => n._id === id);
        if (notification && !notification.isRead) {
          return prevCount - 1;
        }
        return prevCount;
      });

      const response = await readOneNotification(id);
      console.log("readedONe", response);
    } catch (error) {
      console.log(error);
    }
  };

  // Provide the context value
  const contextValue = {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    markAllAsRead,
    clearAll,
    deleteRead,
    toggleRead,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};






 // const handlePushMessage = (event) => {
    //   console.log("New push notification received:", event.data);

    //   setNotifications((prev) => {
    //     // Avoid duplicate notifications based on _id
    //     const exists = prev.some((notif) => notif._id === event.data._id);

    //     if (!exists) {
    //       // Increment unread count for new notifications
    //       setUnreadCount((prevCount) => prevCount + 1);
    //       return [event.data, ...prev]; // Add the new notification to the beginning of the list
    //     }

    //     return prev; // Return the previous state if the notification already exists
    //   });
    // };