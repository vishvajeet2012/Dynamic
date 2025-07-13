import { useProductByKeys } from "../../../hooks/Product/Product";

export default function CategroyPage() {

const params = useParams(); 
  const {ProductByKey   ,loading ,Product, error,success}= useProductByKeys()
  
    return (
        <div>
           
        </div>
    )
}