import { Image } from '@chakra-ui/react'
import React, { useState } from 'react'

import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Static data for demonstration
const listingData = {
  id: '1',
  title: 'Luxurious Beachfront Villa',
  price: 250,
  priceUnit: 'night',
  images: [
    '/placeholder.svg?height=400&width=600&text=Beachfront+Villa+1',
    '/placeholder.svg?height=400&width=600&text=Beachfront+Villa+2',
    '/placeholder.svg?height=400&width=600&text=Beachfront+Villa+3',
  ],
  description: 'Experience luxury living in this stunning beachfront villa. Enjoy breathtaking ocean views, private beach access, and world-class amenities for an unforgettable vacation.',
  averageRating: 4.5,
  totalReviews: 28,
  rules: [
    'No smoking',
    'No pets',
    'No parties or events',
    'Check-in time is 2PM - 8PM',
    'Check out by 11AM',
  ],
  amenities: [
    'Wi-Fi',
    'Air conditioning',
    'Full kitchen',
    'Washer & Dryer',
    'Swimming pool',
    'Beach access',
    'Free parking',
  ],
}

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

const comments = [
  {
    id: '1',
    user: 'David Brown',
    date: '2023-06-18',
    text: 'Is the villa suitable for a family with young children?',
  },
  {
    id: '2',
    user: 'Emma Davis',
    date: '2023-06-17',
    text: 'Are there any good restaurants within walking distance?',
  },
]

export default function TestListingDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [newComment, setNewComment] = useState('')

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => (
      direction === 'next'
        ? (prevIndex + 1) % listingData.images.length
        : (prevIndex - 1 + listingData.images.length) % listingData.images.length
    ))
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    console.log('New review:', newReview)
    // Here you would typically send the review to your backend
    setNewReview({ rating: 0, comment: '' })
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    console.log('New comment:', newComment)
    // Here you would typically send the comment to your backend
    setNewComment('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{listingData.title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold text-gray-900">${listingData.price}</span>
            <span className="text-gray-600">per {listingData.priceUnit}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`w-5 h-5 ${i < Math.floor(listingData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-sm text-gray-600">({listingData.totalReviews} reviews)</span>
            </div>
          </div>

          <div className="relative">
            <Image
              src={listingData.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${listingData.title} - Image ${currentImageIndex + 1}`}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full"
            />
            {listingData.images.length > 1 && (
              <>
                <button 
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
                >
                  <FaChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                  onClick={() => handleImageNavigation('next')}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
                >
                  <FaChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{listingData.description}</p>
          </div>

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

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Your Comment</label>
                <textarea
                  id="comment"
                  rows={3}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Post Comment
              </button>
            </form>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{comment.user}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              {listingData.rules.map((rule, index) => (
                <li key={index} className="text-gray-700">{rule}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {listingData.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}