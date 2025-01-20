import React from 'react'
import { Calendar, MapPin, Star, DollarSign, User, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function ListingDetailsPage() {
  const listing = {
    id: 1,
    title: "Luxury Sedan",
    type: "Car",
    price: 80,
    location: "New York",
    rating: 4.8,
    reviews: 120,
    description: "Experience luxury and comfort with our premium sedan. Perfect for business trips or special occasions.",
    features: ["Leather seats", "GPS navigation", "Bluetooth connectivity", "Fuel efficient"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    owner: {
      name: "John Doe",
      rating: 4.9,
      responseTime: "within an hour",
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      <div className="flex items-center mb-6">
        <MapPin className="mr-2 h-5 w-5" />
        <span>{listing.location}</span>
        <span className="mx-2">•</span>
        <Star className="mr-1 h-5 w-5 text-yellow-400" />
        <span>{listing.rating} ({listing.reviews} reviews)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img src={image} alt={`${listing.title} - Image ${index + 1}`} className="w-full h-[400px] object-cover rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{listing.description}</p>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {listing.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">
                <DollarSign className="inline-block mr-1 h-6 w-6" />
                {listing.price} / day
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Now</Button>
            </CardFooter>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About the Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <User className="h-12 w-12 text-gray-400 mr-4" />
                <div>
                  <h3 className="font-semibold">{listing.owner.name}</h3>
                  <p className="text-sm text-gray-500">
                    <Star className="inline-block mr-1 h-4 w-4 text-yellow-400" />
                    {listing.owner.rating} rating
                  </p>
                </div>
              </div>
              <p className="text-sm flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Responds {listing.owner.responseTime}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Contact Owner</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}