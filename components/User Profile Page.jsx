import React from 'react'
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center">
            <Avatar className="w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">John Doe</CardTitle>
              <CardDescription>Member since 2021</CardDescription>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0 sm:ml-auto">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>Verified User</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rentals" className="mt-8">
          <TabsList>
            <TabsTrigger value="rentals">My Rentals</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>Current Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add list of current rentals here */}
                <p>You have no current rentals.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add list of user's listings here */}
                <p>You have no active listings.</p>
              </CardContent>
              <CardFooter>
                <Button>Create New Listing</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add list of user's reviews here */}
                <p>You haven't written any reviews yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}