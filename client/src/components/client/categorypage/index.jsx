import { useParams } from "react-router-dom";
import { useProductByKeys } from "../../../hooks/Product/Product";
import { useEffect, useState } from "react";

export default function CategroyPage() {
const [categoryIds, setCategory] = useState([]);
const [keyword, setKeyword] = useState(null);
const {id} = useParams()
console.log(id); 

  const {ProductByKeys   ,loading ,Product, error,success}= useProductByKeys()
  useEffect(() => {
      setCategory(id)
      
      
      
  },[id])

  useEffect(() => {
    if (categoryIds) {
      ProductByKeys(categoryIds);
    }
  }, [categoryIds]);
 
    return (
        <div>
           
        </div>
    )
}