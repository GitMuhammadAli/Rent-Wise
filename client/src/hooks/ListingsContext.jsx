import React, { createContext, useReducer } from "react";

export const ListingsContext = createContext();

const listingsReducer = (state, action) => {
  switch (action.type) {
    case "GET_LISTINGS":
      console.log('Current listings in get state:', state.listings); // Log the entire listings array
      console.log("All listing in context", action.payload); 
      return { ...state, listings: action.payload };

    case "GET_ONE_LISTING": // For setting a single listing
      console.log("One listing in context", action.payload);
      return { ...state, currentListing: action.payload };

    case "ADD_LISTING":
      return { ...state, listings: [...state.listings, action.payload] };

    case "UPDATE_LISTING":
      console.log('Updating listing with payload:', action.payload); // Log payload
      console.log('Current listings in state:', state.listings); // Log current listings
      console.log('Length of current listings:', state.listings.length); // Log length of listings
      
      const updatedListings = state.listings.map((listing) => {
        console.log('Listing ID:', listing._id); // Log each listing's ID
        return listing._id === action.payload._id ? action.payload : listing;
      });
      
      console.log('Updated listings:', updatedListings); // Log new state
      return {
        ...state,
        listings: updatedListings,
      };

    case "DELETE_LISTING":
      return {
        ...state,
        listings: state.listings.filter((listing) => listing._id !== action.payload),
      };

    default:
      return state;
  }
};

const initialState = {
  listings: [],
  currentListing: null,
};

// ListingsContext provider to wrap around components
export const ListingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingsReducer, initialState);

  return (
    <ListingsContext.Provider value={{ state, dispatch }}>
      {children}
    </ListingsContext.Provider>
  );
};
