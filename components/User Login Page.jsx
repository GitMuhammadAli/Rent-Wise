import React from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Review() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Write a Review</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Luxury Sedan Rental</CardTitle>
            <CardDescription>Rented from John's Car Rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/placeholder.svg?height=100&width=100" alt="Luxury Sedan" className="w-16 h-16 rounded-md object-cover" />
              <div>
                <h3 className="font-semibold">Mercedes-Benz E-Class</h3>
                <p className="text-sm text-gray-500">May 15, 2023 - May 18, 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>Share your experience with other renters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Overall Rating</Label>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 text-yellow-400 cursor-pointer" />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  placeholder="Write your review here..."
                  className="mt-1"
                  rows={5}
                />
              </div>
              <div>
                <Label>Would you recommend this rental?</Label>
                <div className="flex space-x-4 mt-1">
                  <Button variant="outline" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Yes
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    No
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Review</Button>
          </CardFooter>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI-Powered Sentiment Analysis</CardTitle>
            <CardDescription>Our AI will analyze your review to highlight key points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <span>Positive: Great experience, smooth ride</span>
              </div>
              <div className="flex items-center space-x-2">
                <ThumbsDown className="h-5 w-5 text-red-500" />
                <span>Negative: Slight delay in pickup</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">This analysis is generated automatically and may not be 100% accurate.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}