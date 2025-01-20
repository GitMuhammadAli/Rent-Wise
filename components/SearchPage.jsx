import React, { useState } from 'react'
import { Search, Filter, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  const listings = [
    { id: 1, title: "Luxury Sedan", type: "Car", price: 80, location: "New York", image: "/placeholder.svg?height=100&width=200" },
    { id: 2, title: "Mountain Bike", type: "Bike", price: 25, location: "Denver", image: "/placeholder.svg?height=100&width=200" },
    { id: 3, title: "Beachfront Apartment", type: "Apartment", price: 150, location: "Miami", image: "/placeholder.svg?height=100&width=200" },
    { id: 4, title: "Luxury Hotel Room", type: "Hotel", price: 200, location: "Las Vegas", image: "/placeholder.svg?height=100&width=200" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Rentals</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input 
          className="flex-grow" 
          placeholder="Search for rentals..." 
          startAdornment={<Search className="text-gray-400" />}
        />
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Cars</SelectItem>
            <SelectItem value="bike">Bikes</SelectItem>
            <SelectItem value="apartment">Apartments</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Price Range</label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Enter location" className="mt-1" />
              </div>
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{listing.type}</p>
                <p className="text-lg font-bold">${listing.price}/day</p>
                <p className="text-sm flex items-center mt-2">
                  <MapPin className="mr-1 h-4 w-4" /> {listing.location}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}