import React from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchResults() {
  const results = [
    { id: 1, name: 'Luxury Apartment', category: 'Apartments', price: '$1200/month', image: '/placeholder.svg?height=200&width=300' },
    { id: 2, name: 'Sports Car', category: 'Cars', price: '$100/day', image: '/placeholder.svg?height=200&width=300' },
    { id: 3, name: 'Mountain Bike', category: 'Bikes', price: '$25/day', image: '/placeholder.svg?height=200&width=300' },
    { id: 4, name: 'Beachfront Hotel', category: 'Hotels', price: '$150/night', image: '/placeholder.svg?height=200&width=300' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex-grow flex items-center space-x-2 w-full md:w-auto">
          <Input type="text" placeholder="Search rentals..." className="w-full md:w-64" />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="apartments">Apartments</SelectItem>
              <SelectItem value="cars">Cars</SelectItem>
              <SelectItem value="bikes">Bikes</SelectItem>
              <SelectItem value="hotels">Hotels</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <img src={result.image} alt={result.name} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{result.name}</CardTitle>
              <p className="text-gray-600 mb-2">{result.category}</p>
              <p className="font-bold text-primary">{result.price}</p>
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