

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import {Link} from 'react-router-dom'
import { Button,
  Input , 
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Avatar,
  UnorderedList,
  ListItem,
  Text,} from "@chakra-ui/react"
import { PlaceBid } from "../../Api/ListingApi"
import { useAuth } from "../../hooks/AuthContext"






export default function BiddingSystem({currentListing}) {
  const [bids, setBids] = useState([])
  const [newBid, setNewBid] = useState("")
  const toast = useToast();
  const {user} = useAuth();
  
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
      
    // the new bid a user will submit will be added in it and displayed for real-time
      const newBidSubmited = {
        
        bidAmount: bidAmount,
        bidDate: Date().now,
        user: {
         imageUrl: user.imageUrl,
         name: user.name,
         _id: user._id
        }
      }
       
       //here we will add that bid with others and then again sort them with the bidAmount
      const updatedBids = [newBidSubmited, ...bids]
        .sort((a, b) => b.bidAmount - a.bidAmount)
        .slice(0, 5);
      // here we updated that state
        setBids(updatedBids);
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
  };

  useEffect(()=>{

      const top5Bids = [...currentListing.bidding.bids].sort((a, b) => b.bidAmount - a.bidAmount).slice(0, 5);
      console.log('top five are ', top5Bids)
      setBids(top5Bids)

  },[currentListing])

  

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full">
      <div className="bg-orange-400 text-white p-4">
        {
          currentListing?.owner._id === user?._id && (
            <p></p>
          )
        }
        
        <h2 className="text-2xl font-bold">Bidding System</h2>
      </div>
      <div className="p-4">
      {
        currentListing?.owner._id !== user?._id && (
          <form onSubmit={handleBid} className="mb-6">
          <div className="flex gap-2">
              <NumberInput
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

        )
      }
      
        <div>
          <h3 className="text-lg font-semibold mb-3">Top 5 Bids</h3>
          <UnorderedList className="space-y-3" m={0} p={0} >
            {bids && bids.lenght > 0 ? (
              bids?.map((bid, i) => (
             
                <ListItem as={Link} to={`/profile/${bid.user._id}`} key={i} className="flex items-center gap-3 bg-orange-50 p-3 rounded-md">
                  
                  {bid.user.imageUrl ? (
                    
                    <Avatar
                      src={`${import.meta.env.VITE_BACK_END_URL}${bid.user.imageUrl}` || "/placeholder.svg"}
                      alt={bid.user.name}                    
                    />
                  ) : (
                    <User className="w-10 h-10 p-2 bg-orange-200 rounded-full text-orange-600" />
                  )}
                  <div className="flex-grow">
                   
                    <p className="font-medium">{bid.user.name}</p> 
                    <p className="text-sm text-gray-600">${bid?.bidAmount?.toLocaleString()}</p>
                  </div>
                </ListItem>
                  
              ))
            ) : (
              <Text>No biddings yet</Text>
            ) }
          </UnorderedList>
        </div>
      </div>
    </div>
  )
}

