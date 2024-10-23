import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/dashboard`;



// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getUser = () =>
  axios.get(`${API_BASE_URL}/getUserDashboard`, { withCredentials: true });



  


  