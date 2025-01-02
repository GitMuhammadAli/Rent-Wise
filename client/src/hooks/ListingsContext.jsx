import React, { createContext, useEffect, useReducer } from "react";
import { getAlListingsofSpecificUser } from "../Api/ListingApi";
import { useAuth } from "./AuthContext";


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

      case "GET_USER_LISTINGS": // For getting or setting listings for a specific user
      console.log("Listings for specific user", action.payload); 
      return { ...state, userListings: action.payload };

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
  userListings: [],
};

// ListingsContext provider to wrap around components
export const ListingsProvider = ({ children }) => {
  
   const { user } = useAuth();
  const [state, dispatch] = useReducer(listingsReducer, initialState);



  useEffect(() => {
    async function getOwnerListings() {
      console.log("uuuuser", user)
      if (user && user._id) {
        const user_id = user._id;
        console.log("User id is:", user_id);
  
        const response = await getAlListingsofSpecificUser(user_id);
        console.log("Response of user in ownerdash is: ", response.data);
      
  
        // setItems(response.data.listing);
        dispatch({ type: "GET_USER_LISTINGS", payload: response.data.listing });
        console.log("listing in ownerdash are:", response.data.listing);
      }
    }
    getOwnerListings();
  }, [user]);

  return (
    <ListingsContext.Provider value={{ state, dispatch }}>
      {children}
    </ListingsContext.Provider>
  );
};


