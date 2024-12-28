import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/agreement`





export const createAgreement = (payload) =>
  axios.post(`${API_BASE_URL}/createAggreement`, payload, { withCredentials: true });


export const SentAggreement = (payload) => 
  axios.post(`${API_BASE_URL}/sentaggreement`, payload, { withCredentials: true });