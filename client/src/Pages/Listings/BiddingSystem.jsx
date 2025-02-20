

import { useState } from "react"
import { User } from "lucide-react"
import { Button,
  Input , 
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Avatar,} from "@chakra-ui/react"
import { PlaceBid } from "../../Api/ListingApi"




const initialBids =  [
  { id: 1, user: { name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" }, amount: 1500 },
  { id: 2, user: { name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" }, amount: 1450 },
  { id: 3, user: { name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" }, amount: 1400 },
  { id: 4, user: { name: "Diana Prince", avatar: "/placeholder.svg?height=40&width=40" }, amount: 1350 },
  { id: 5, user: { name: "Ethan Hunt", avatar: "/placeholder.svg?height=40&width=40" }, amount: 1300 },
]

export default function BiddingSystem({currentListing}) {
  const [bids, setBids] = useState(initialBids)
  const [newBid, setNewBid] = useState("")
  const toast = useToast();

  const handleBid = async (e) => {
    e.preventDefault();
    if(!currentListing) {
      console.log("no current listing")
      return;
    }
    const bidAmount = parseFloat(newBid);
    if (isNaN(bidAmount) || bidAmount <= 0) return;
  
    const newBidEntry = {
    
      rentalItemId: currentListing._id,
      bidAmount: bidAmount,
    };

    try {
      const response = await PlaceBid(newBidEntry);
      console.log('response of bid', response)
      if(response.status === 200)
      {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      setNewBid("");


      
    } catch (error) {
      console.log(error)
      toast({
        title: `${error.response.data.error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

   
  
    // const updatedBids = [newBidEntry, ...bids].sort((a, b) => b.amount - a.amount).slice(0, 5);
    // setBids(updatedBids);
    
  };
  

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full">
      <div className="bg-orange-400 text-white p-4">
        <h2 className="text-2xl font-bold">Bidding System</h2>
      </div>
      <div className="p-4">
        <form onSubmit={handleBid} className="mb-6">
          <div className="flex gap-2">
            {/* <Input
              type="number"
              placeholder="Enter your bid"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
              Place Bid
            </Button> */}

              <NumberInput
               // value={newBid}
               onChange={(valueString) => setNewBid(valueString)}
               defaultValue={currentListing.bidding.highestBid} min={currentListing.bidding.minimumBid}  w={'full'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
                <Button type="submit" colorScheme="orange" rounded="full">
                  Place Bid
                </Button>
          </div>
        </form>
        <div>
          <h3 className="text-lg font-semibold mb-3">Top 5 Bids</h3>
          <ul className="space-y-3">
            {currentListing.bidding.bids?.map((bid) => (
              <li key={bid._id} className="flex items-center gap-3 bg-orange-50 p-3 rounded-md">
                {bid.user.avatar ? (
                  <Avatar
                    src={bid.user.avatar || "/placeholder.svg"}
                    alt={bid.user.name}                    
                  />
                ) : (
                  <User className="w-10 h-10 p-2 bg-orange-200 rounded-full text-orange-600" />
                )}
                <div className="flex-grow">
                  {/* display name instead of id */}
                  <p className="font-medium">{bid.user}</p> 
                  <p className="text-sm text-gray-600">${bid.bidAmount.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

