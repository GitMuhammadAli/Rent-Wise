import axios from "axios";

const API_BASE_URL = "http://localhost:3600/listings";

export const createListing = (data) =>
  axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const getAllListing = () =>
  axios.get(`${API_BASE_URL}/all`, { withCredentials: true });

