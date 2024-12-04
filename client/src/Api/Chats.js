
import axios from 'axios';

// const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/chats`;
const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/conversations`;


// export const createChatAPI = (data) =>
//     axios.post(`${API_BASE_URL}/createMessage`, data, { withCredentials: true });



// export const getChatsAPI = (receiverId, listingId) =>
//     axios.get(`${API_BASE_URL}/getMessages/${receiverId}/${listingId}`, { withCredentials: true })
//         .catch((error) => {
//             console.error(error.response.data);
//             console.error(error.response.status);
//             console.error(error.response.headers);
//         });


//   export const getChatsAPI = (param) =>
//       axios.get(`${API_BASE_URL}/getMessages?${param}`, { withCredentials: true })
//           .catch((error) => {
//               console.error(error.response.data);
//               console.error(error.response.status);
//               console.error(error.response.headers);
//           });


// export const getSideBarParticipants = () =>
//     axios.get(`${API_BASE_URL}/sidebar`, { withCredentials: true })
//         .catch((error) => {
//             console.error(error.response.data);
//             console.error(error.response.status);
//             console.error(error.response.headers);
//         });




// Converstaion Routes New-One
export const createOrGetConversation = (data) =>
    axios.post(`${API_BASE_URL}/CreateorGetconversations`, data, { withCredentials: true })
        .catch((error) => {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        });




export const createMessage = (data) =>  ///thiiis
    axios.post(`${API_BASE_URL}/CreateMessages`, data, { withCredentials: true })
        .catch((error) => {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        });




export const fetchConversationsForSidebar = () =>
    axios.get(`${API_BASE_URL}/GetAllConversations`, { withCredentials: true })
        .catch((error) => {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        });



export const fetchMessagesByConversation = (conversationId) =>
    axios.get(`${API_BASE_URL}/FetchAllMessages/${conversationId}/messages`, { withCredentials: true })
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

