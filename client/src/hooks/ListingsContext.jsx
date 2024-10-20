import React, { createContext, useReducer } from "react";


export const ListingsContext = createContext();


const listingsReducer = (state, action) => {
  switch (action.type) {
    case "GET_LISTINGS":
      return { ...state, listings: action.payload };
    case "GET_ONE_LISTING": // For setting a single listing
      return { ...state, currentListing: action.payload };
    case "ADD_LISTING":
      return { ...state, listings: [...state.listings, action.payload] };
    case "UPDATE_LISTING":
      return {
        ...state,
        listings: state.listings.map((listing) =>
          listing._id === action.payload._id ? action.payload : listing
        ),
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
