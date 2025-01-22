import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  StarIcon,
  MessageCircleIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { getOwnerProfileData } from "../../../Api/owner";

const API_BASE_URL = "YOUR_API_BASE_URL"; // Replace with your actual API base URL

const UserProfile = () => {
  const { _id } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getOwnerProfileData(_id); // Use _id from route params
        const { user, listings } = response.data.data;
        setUser(user);
        setListings(listings);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* User Information */}
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full mr-4"
            src={
                `${import.meta.env.VITE_BACK_END_URL}${user.imageUrl}` ||
                user.imageUrl
              }
            alt={user.name}
            onError={(e) => (e.currentTarget.src = "/default-profile.png")} // Fallback image
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-700">{user.bio || "No bio provided."}</p>
        <div className="mt-4 flex gap-4 text-gray-600">
          {user.email && (
            <span>
              <MailIcon className="inline h-5 w-5 mr-2" />
              {user.email}
            </span>
          )}
          {user.phoneNumber && (
            <span>
              <PhoneIcon className="inline h-5 w-5 mr-2" />
              {user.phoneNumber}
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "listings"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            Listings
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "reviews"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="mt-6 grid gap-6">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <div
                  key={listing._id}
                  className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <img
                    className="h-16 w-16 object-cover rounded-lg mr-4"
                    src={`${import.meta.env.VITE_BACK_END_URL}${listing.images[0]?.url || ""}`}
                    alt={listing.title}
                    onError={(e) => (e.currentTarget.src = "/images/make_listing/random.png")} // Fallback image
                  />
                  <div>
                    <h2 className="font-bold">{listing.title}</h2>
                    <p>
                      ${listing.price} / {listing.priceUnit}
                    </p>
                    <div className="flex items-center text-yellow-500 mt-2">
                      <StarIcon className="h-5 w-5" />
                      <span className="ml-1">
                        {listing.averageRating.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No listings available.</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4">
            {user.userReview.length > 0 ? (
              user.userReview.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between">
                    <h3 className="font-bold">{review.reviewer}</h3>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                  <p>{review.comment}</p>
                  <div className="flex text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}

        {/* Contact Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition duration-300 flex items-center">
            <MessageCircleIcon className="h-5 w-5 mr-2" />
            Contact {user.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
