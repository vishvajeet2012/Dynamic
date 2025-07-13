import { useParams } from "react-router-dom";
import { useProductByKeys } from "../../../hooks/Product/Product";
import { useEffect, useState } from "react";

export default function CategroyPage() {
const [categoryIds, setCategory] = useState(null);
const [keyword, setKeyword] = useState(null);
const {id} = useParams()
console.log(id); 

  const {ProductByKey   ,loading ,Product, error,success}= useProductByKeys()
  useEffect(() => {
      setCategory(id)
      
        ProductByKey(categoryIds)
      
  },[id])
  console.log(Product)
    return (
        <div>
           
        </div>
    )
}