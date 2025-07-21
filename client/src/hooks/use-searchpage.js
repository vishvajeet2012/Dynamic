import axios from "axios"
import { useState } from "react"
import { homeUrl } from "../lib/baseUrl"

export const  useSearchPage=()=>{
    
   

const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [searchResult, setSearchResult] = useState(null);



        const searchPage = async (keywords)=>{


            try{
    const response = await axios.post(`${homeUrl}/getproductsearchpage`,{keywords},
{
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      setSearchResult(response.data);
      setSuccess(true); 
 } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch child category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { searchPage, searchResult, loading, error, success };
}