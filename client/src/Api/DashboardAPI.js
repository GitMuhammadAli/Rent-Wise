import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/dashboard`;


// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getUser = () =>
  axios.get(`${API_BASE_URL}/getUserDashboard`, { withCredentials: true });

export const updateUserDashboard = async (id, formData) => {
  return await axios.put(`${API_BASE_URL}/updateUserDashboard/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const ToGetReview = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews`, { withCredentials: true });
    return response;  // Ensure the function returns the response properly
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

  