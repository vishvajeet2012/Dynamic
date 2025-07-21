import { useParams } from "react-router-dom";
import { useProductByKeys } from "../../../hooks/Product/Product";
import { useEffect, useState } from "react";
import CateogryProduct from "./CateogryProduct";

// id from URL will be treated as subcategoryId or childCategoryId
export default function CategroyPage() {
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const { id } = useParams(); // this is NOT categoryId as you said

  const { ProductByKeys, loading, Product } = useProductByKeys();

  // Set subcategoryId or childCategoryId from URL when page loads
  useEffect(() => {
    if (id) {
      setData((prev) => ({
        ...prev,
        subcategoryIds: [id], // or childCategoryIds: [id] based on your logic
      }));
    }
  }, [id]);

  // Fetch products when data (filters) update
  useEffect(() => {
    if (data) {
      ProductByKeys(data);
    }
  }, [data]);

  // Save products from API result
  useEffect(() => {
    setProducts(Product);
  }, [Product]);

  // Merge new filters into existing `data` state
  const handleFilterUpdate = (newFilters) => {
    setData((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div>
      <CateogryProduct
        setData={handleFilterUpdate}
        Productloading={loading}
        id={id}
        Products={products}
      />
    </div>
  );
}
