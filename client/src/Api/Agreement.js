import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/agreement`





export const createAgreement = (payload) =>
  axios.post(`${API_BASE_URL}/createAggreement`, payload, { withCredentials: true });


export const SentAggreement = (payload) => 
  axios.post(`${API_BASE_URL}/sentaggreement`, payload, { withCredentials: true });

export const GetAggreements = () => 
  axios.get(`${API_BASE_URL}/GetByOwnerId`, { withCredentials: true });

export const GetAggreementsByID = (aggId) => 
  axios.get(`${API_BASE_URL}/getAggrementDetails`,{aggId}, { withCredentials: true });