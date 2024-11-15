import React, { useState,useEffect } from 'react'
import { getComments } from '../../../Api/commentsApi';

export default function ListingComments({currentID}) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchData() {
          try {
            if(currentID)
            {
                const response = await getComments(currentID);
                console.log("comments are: ", response.data);
                setComments(response.data.comments);
                console.log("curr idd", currentID)
            }
            
                    
          } catch (error) {
            console.error("Error fetching listings:", error);
          }
        }
    
        fetchData();
      }, []);
  return (
    <div>

        {
            
            comments && comments.length > 0 && comments.map((comment,index)=>(
                <li key={comment._id}>{comment.text}--{comment._id}</li>
            ))
        }

      
    </div>
  )
}
