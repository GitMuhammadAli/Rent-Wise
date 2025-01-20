import React from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CategoryListing() {
  const rentals = [
    { id: 1, name: 'Luxury Sedan', price: '$80/day', image: '/placeholder.svg?height=200&width=300', rating: 4.5 },
    { id: 2, name: 'SUV', price: '$100/day', image: '/placeholder.svg?height=200&width=300', rating: 4.2 },
    { id: 3, name: 'Economy Car', price: '$50/day', image: '/placeholder.svg?height=200&width=300', rating: 4.0 },
    { id: 4, name: 'Sports Car', price: '$150/day', image: '/placeholder.svg?height=200&width=300', rating: 4.8 },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Cars for Rent</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex-grow flex items-center space-x-2 w-full md:w-auto">
          <Input type="text" placeholder="Search cars..." className="w-full md:w-64" />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rentals.map((rental) => (
          <Card key={rental.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <img src={rental.image} alt={rental.name} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{rental.name}</CardTitle>
              <p className="text-gray-600 mb-2">Rating: {rental.rating}/5</p>
              <p className="font-bold text-primary">{rental.price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">
          Load More
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}