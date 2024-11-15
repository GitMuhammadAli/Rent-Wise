

import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/comments`;


// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const AddComment = (data) =>
    axios.post(`${API_BASE_URL}/createListingComment`, data, { withCredentials: true });

  