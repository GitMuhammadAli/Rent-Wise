import React, { useContext, useEffect } from 'react'
import { ListingsContext } from '../../../hooks/ListingsContext'

export default function HostelListing() {
const { state } = useContext(ListingsContext); 
  const { listings } = state; 
    useEffect(()=>{
        console.log("Listing in hostel",listings)

        const categoryBased = listings.filter((item)=> item.category === 'hostel' )

        console.log("are", categoryBased);
    },[listings])
  return (
    <div>
      
    </div>
  )
}
