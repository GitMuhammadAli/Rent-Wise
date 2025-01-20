import React from 'react'
import { Calendar, DollarSign, Star, Clock, User, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ItemDetail() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Luxury Sedan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img src="/placeholder.svg?height=400&width=600" alt="Luxury Sedan" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">$80 / day</CardTitle>
                <CardDescription>Available for rent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>4.5 (120 reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Instant booking available</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>4 seats</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>Pick-up location: Downtown</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Check Availability
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-8">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>About this car</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This luxury sedan offers a smooth and comfortable ride with its advanced suspension system and spacious interior. Perfect for business trips or special occasions.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Car Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Leather seats</li>
                  <li>GPS navigation</li>
                  <li>Bluetooth connectivity</li>
                  <li>Backup camera</li>
                  <li>Sunroof</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample review */}
                  <div>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-2 text-sm text-gray-600">John D.</span>
                    </div>
                    <p className="text-sm">Great car, smooth ride. Would definitely rent again!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Before & After Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for Before & After comparison slider */}
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <p>Before & After Comparison Slider</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}