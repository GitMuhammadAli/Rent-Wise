import React, { useState } from 'react'
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
const reviews = [
  {
    id: '1',
    user: 'Alice Johnson',
    rating: 5,
    date: '2023-06-15',
    comment: 'Absolutely stunning villa! The views were breathtaking and the amenities were top-notch. We had an unforgettable stay.',
  },
  {
    id: '2',
    user: 'Bob Smith',
    rating: 4,
    date: '2023-05-28',
    comment: 'Great location and beautiful property. The only minor issue was that the Wi-Fi was a bit slow at times.',
  },
  {
    id: '3',
    user: 'Carol Williams',
    rating: 5,
    date: '2023-05-10',
    comment: "Perfect getaway! The villa was immaculate and the private beach access was a huge plus. We'll definitely be back!",
  },
]

export default function ReviewsInListing() {
   const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const handleReviewSubmit =()=>{
    console.log('rllo')
  }
  return (
    <div>
      <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                  <form onSubmit={handleReviewSubmit} className="mb-6">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="text-2xl focus:outline-none"
                          >
                            {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="review" className="block text-gray-700 text-sm font-bold mb-2">Your Review</label>
                      <textarea
                        id="review"
                        rows={4}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Submit Review
                    </button>
                  </form>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{review.user}</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
      
    </div>
  )
}
