import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./components/Home";
import Cookies from "js-cookie";
import decodeToken from "./utils/jwt";
import { AuthProvider } from "./hooks/AuthContext";
import Otp from "./components/Otp";
import GetAllListings from "../src/Pages/Listings/GetAllListings";
// import MakeListing from "../Pages/Listings/MakeListing";
import NewListings from "../src/Pages/Listings/NewListings";
import { ListingsProvider } from "./hooks/ListingsContext";
import Media from "../src/Pages/Listings/Media";
import ListingDetails from "../src/Pages/Listings/ListingDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import MyAccount from "../src/Pages/Account/MyAccount";
import DashboardUserContextProvider from "./hooks/DashboardUserContext";
import UpdateListing from "./Pages/Listings/updateListing";
import MainChat from "./Pages/Conversation/MainChat";
import AgreementTemplate from "./Pages/Agreement/AgreementTemplate";
// import UpdateAgreement from "./Pages/Agreement/UpdateAgreement";
import CarAgreement from "./Pages/Agreement/Car/CarAgreement";
import UpdateCarAgrr from "./Pages/Agreement/Car/UpdateCarAgrr";
import UpdateHouseAgrr from "./Pages/Agreement/House/UpdateHouseAgrr";
import SendToTenant from "./Pages/Agreement/SendToTenant";
import ViewHouseAgr from "./Pages/Agreement/ViewAgreement.jsx/ViewHouseAgr";
import ViewCarAgr from "./Pages/Agreement/ViewAgreement.jsx/ViewCarAgr";
import HostelListing from "./Pages/Listings/CategoryBased/HostelListing";
import HouseListing from "./Pages/Listings/CategoryBased/HouseListing";
import CarListing from "./Pages/Listings/CategoryBased/CarListing";
import DisplayAgreements from "./Pages/Agreement/Admin/DisplayAgreements";
import Integration from "./Pages/Agreement/Admin/Integration";




function YourComponent() {
  const token = Cookies.get("jwt");

  if (token) {
    const decodedToken = decodeToken(token);
    console.log("Decoded JWT Token:", decodedToken);
  }

  console.log("JWT Token:", token);

  return <div>Your Component</div>;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route element={<ProtectedRoute requiredStatus="unauthenticated" />}>
          <Route path="/auth/signIn" element={<SignIn />} />
        </Route>
        <Route path="/auth/forgetPassword" element={<ForgotPassword />} />
        <Route path="/auth/resetPassword" element={<ResetPassword />} />
        <Route path="/you" element={<YourComponent />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/auth/otp" element={<Otp/>} />
      </Route>
      
      {/* home */}
      
      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* listing on basis of catagories */}

        <Route path="/categories/hostels" element={<HostelListing />} />
        <Route path="/categories/house" element={<HouseListing />} />
        <Route path="/categories/cars" element={<CarListing />} />

        <Route path="/getAll" element={<GetAllListings />} />
        
        {/* <Route path="/createListings" element={<MakeListing />} /> */}
        <Route path="/createNewListings" element={<NewListings />} />
        <Route path="/media" element={<Media />} />
        <Route path="/rental/:id" element={<ListingDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acc" element={<MyAccount />} />
        <Route path="/listings/:id" element={<UpdateListing />} />
        <Route path="/chat" element={<MainChat/>} />
        <Route path="/agreement" element={<AgreementTemplate/>} />
        <Route path="/sendToTenant" element={<SendToTenant/>} />
        {/* <Route path="/agreements/:id" element={<UpdateAgreement/>} /> */}
        <Route path="/agreementCar/:id" element={<UpdateCarAgrr/>} />
        <Route path="/agreementHouse/:id" element={<UpdateHouseAgrr/>} />

        {/* view of agreement */}
        <Route path="/viewHouseAgreement/:_id" element={<ViewHouseAgr/>} />
        <Route path="/viewCarAgreement/:_id" element={<ViewCarAgr/>} />

        {/* <Route path="/UpdateAgreement" element={<UpdateAgreement/>} /> */}
        {/* <Route path="/chat" element={<MainChat/>} /> */}

        {/* <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/getAll" element={<GetAllListings />} />
        </Route> */}

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/category/*" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/agreements-protected" element={<DisplayAgreements />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/integration" element={<Integration/>} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <DashboardUserContextProvider>
        <ListingsProvider>
          <RouterProvider router={router} />
        </ListingsProvider>
      </DashboardUserContextProvider>
    </AuthProvider>
  );
}

export default App;