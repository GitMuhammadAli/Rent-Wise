import React from 'react'
import { FileText, Download, Eye, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AgreementManagement() {
  const agreements = [
    { id: 1, name: 'Luxury Sedan Rental Agreement', status: 'Signed', date: '2023-05-15' },
    { id: 2, name: 'Apartment Lease Agreement', status: 'Pending', date: '2023-06-01' },
    { id: 3, name: 'Mountain Bike Rental Agreement', status: 'Expired', date: '2023-04-30' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Agreement Management</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Agreements</CardTitle>
            <CardDescription>View and manage your current rental agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agreement Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium">{agreement.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agreement.status === 'Signed' ? 'bg-green-100 text-green-800' :
                        agreement.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agreement.status}
                      </span>
                    </TableCell>
                    <TableCell>{agreement.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Agreement</CardTitle>
            <CardDescription>Sign a new rental agreement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-semibold">Luxury Sedan Rental Agreement</h3>
                  <p className="text-sm text-gray-500">Please review and sign the agreement</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">2 pages · PDF · 1.2 MB</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Sign Agreement
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}