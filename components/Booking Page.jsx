import React from 'react'
import { Calendar, CreditCard, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingPage() {
  const booking = {
    id: 1,
    title: "Luxury Sedan",
    type: "Car",
    price: 80,
    location: "New York",
    image: "/placeholder.svg?height=100&width=200",
    startDate: "2023-07-15",
    endDate: "2023-07-18",
    totalDays: 3,
    totalPrice: 240,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <img src={booking.image} alt={booking.title} className="w-24 h-24 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{booking.title}</h3>
                  <p className="text-sm text-gray-500">{booking.type} in {booking.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-semibold">Dates</p>
                  <p className="text-sm">{booking.startDate} to {booking.endDate} ({booking.totalDays} days)</p>
                </div>
              </div>

              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter your full name" />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>

              <div>
                <Label>Special Requests</Label>
                <Input placeholder="Any special requests?" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>

              <div>
                <Label>Card Number</Label>
                <Input placeholder="Enter your card number" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiration Date</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="MM/YY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01/24">01/24</SelectItem>
                      <SelectItem value="02/24">02/24</SelectItem>
                      <SelectItem value="03/24">03/24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input placeholder="CVV" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>${booking.price} x {booking.totalDays} days</span>
                <span>${booking.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>$24</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${booking.totalPrice + 24}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Confirm and Pay</Button>
            </CardFooter>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Free cancellation for 48 hours. After that, cancel before 2:00 PM on {booking.startDate} and get a full refund, minus the service fee.</p>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center text-sm text-gray-500">
            <Shield className="h-5 w-5 mr-2" />
            <p>RentWise offers protection for both renters and owners.</p>
          </div>
        </div>
      </div>
    </div>
  )
}