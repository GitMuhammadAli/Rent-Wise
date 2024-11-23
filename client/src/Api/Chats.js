
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/chats`;


export const createChatAPI = (data) =>
    axios.post(`${API_BASE_URL}/createMessage`, data, { withCredentials: true });


  export const getChatsAPI = (param) =>
      axios.get(`${API_BASE_URL}/getMessages?${param}`, { withCredentials: true })
          .catch((error) => {
              console.error(error.response.data);
              console.error(error.response.status);
              console.error(error.response.headers);
          });


  export const getSideBarParticipants = () =>
      axios.get(`${API_BASE_URL}/sidebar`, { withCredentials: true })
          .catch((error) => {
              console.error(error.response.data);
              console.error(error.response.status);
              console.error(error.response.headers);
          });

