import React from 'react'
import { DollarSign, Clock, Users, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default function Bidding() {
  const bids = [
    { id: 1, user: 'John Doe', amount: 150, time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', amount: 145, time: '3 hours ago' },
    { id: 3, user: 'Bob Johnson', amount: 140, time: '5 hours ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bidding: Luxury Sedan (Weekend Rental)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Bid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$150</div>
              <p className="text-xs text-muted-foreground">+$5 from previous bid</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Left</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4h 23m</div>
              <Progress value={33} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">3 new bids in last hour</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Place Your Bid</CardTitle>
            <CardDescription>Enter an amount higher than the current bid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input type="number" placeholder="Enter your bid" />
              <Button>Place Bid</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map((bid, index) => (
                  <TableRow key={bid.id}>
                    <TableCell className="font-medium">{bid.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        ${bid.amount}
                        {index === 0 && <ArrowUp className="h-4 w-4 text-green-500 ml-2" />}
                        {index > 0 && <ArrowDown className="h-4 w-4 text-red-500 ml-2" />}
                      </div>
                    </TableCell>
                    <TableCell>{bid.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Bids</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}