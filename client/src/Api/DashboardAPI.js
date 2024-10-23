import axios from "axios";


// const API_BASE_URL = `${process.env.REACT_APP_BACK_END_URL}/listings`
const API_BASE_URL = `http://localhost:3600/dashboard`

// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getUser = () =>
  axios.get(`${API_BASE_URL}/getUserDashboard`, { withCredentials: true });



  


  