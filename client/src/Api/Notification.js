import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/notification`

export const getNotifications = () => {
  return axios.get(`${API_BASE_URL}/get-notifications`);
};

export const readAllNotifications = () => {
  return axios.patch(`${API_BASE_URL}/read-all-notifications`);
};

export const clearAllNotifications = () => {
  return axios.delete(`${API_BASE_URL}/clear-all-notifications`);
};

export const readOneNotification = (notificationId) => {
  return axios.patch(`${API_BASE_URL}/read-notification/${notificationId}`);
};