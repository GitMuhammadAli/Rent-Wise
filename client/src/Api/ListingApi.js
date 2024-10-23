import axios from "axios";


// const API_BASE_URL = `${process.env.REACT_APP_BACK_END_URL}/listings`
const API_BASE_URL = `http://localhost:3600/listings`

// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getAllListingAPI = () =>
  axios.get(`${API_BASE_URL}/all`, { withCredentials: true });

export const uploadMediaAPI = (formData) =>
  axios.post(`${API_BASE_URL}/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  export const getOneUserListingAPI = (id) =>
    axios.get(`${API_BASE_URL}/GetListingsById/${id}`, { withCredentials: true });
  


  