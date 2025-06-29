import { useEffect } from "react"
import { useAdminGetProduct } from "../../../hooks/Product/Product"

export default function AdminGetProduct() {
const {AdmingetProduct,loading ,Product, error,success}=   useAdminGetProduct()

useEffect(()=>
{
AdmingetProduct()
},[])
console.log(Product?.data)

    return (
        <div>
        </div>
    )
}