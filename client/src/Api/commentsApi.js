

import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACK_END_URL}/comments`;


// export const createListingAPI = (data) =>
//   axios.post(`${API_BASE_URL}/create`, data, { withCredentials: true });

export const AddComment = (data) =>
    axios.post(`${API_BASE_URL}/createListingComment`, data, { withCredentials: true });


export const getComments = (ListingId) =>
    axios.get(`${API_BASE_URL}/showSpecificListComments/${ListingId}`, { withCredentials: true });


export const getCommentswithReplies = (ListingId) =>
    axios.get(`${API_BASE_URL}/CommentWithReply/${ListingId}`, { withCredentials: true });

