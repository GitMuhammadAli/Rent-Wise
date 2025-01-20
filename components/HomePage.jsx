import React from 'react'
import { Search, Car, Bike, Building, Hotel, Bell, User, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Dashboard() {
  const categories = [
    { name: 'Cars', icon: Car },
    { name: 'Bikes', icon: Bike },
    { name: 'Apartments', icon: Building },
    { name: 'Hotels', icon: Hotel },
  ]

  const featuredRentals = [
    { id: 1, name: 'Luxury Apartment', category: 'Apartments', price: '$1200/month', image: '/placeholder.svg?height=100&width=200' },
    { id: 2, name: 'Sports Car', category: 'Cars', price: '$100/day', image: '/placeholder.svg?height=100&width=200' },
    { id: 3, name: 'Mountain Bike', category: 'Bikes', price: '$25/day', image: '/placeholder.svg?height=100&width=200' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">RentWise</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Rental</h2>
            <div className="flex space-x-4">
              <Input type="text" placeholder="Search rentals..." className="flex-grow" />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <category.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Rentals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRentals.map((rental) => (
                <Card key={rental.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <img src={rental.image} alt={rental.name} className="w-full h-40 object-cover rounded-t-lg" />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{rental.name}</CardTitle>
                    <CardDescription>{rental.category}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-bold text-primary">{rental.price}</span>
                    <Button variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  My Rentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>View and manage your current rentals</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Go to My Rentals</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your payments and view transaction history</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Go to Payments</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}