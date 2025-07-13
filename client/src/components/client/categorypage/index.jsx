import { useParams } from "react-router-dom";
import { useProductByKeys } from "../../../hooks/Product/Product";

export default function CategroyPage() {

const {id} = useParams()
console.log(id); 

  const {ProductByKey   ,loading ,Product, error,success}= useProductByKeys()
  
    return (
        <div>
           
        </div>
    )
}