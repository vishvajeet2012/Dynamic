import { useParams } from "react-router-dom";
import { useProductByKeys } from "../../../hooks/Product/Product";
import { useEffect, useState } from "react";
import CateogryProduct from "./CateogryProduct";

export default function CategroyPage() {
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const { id } = useParams(); 

  const { ProductByKeys, loading, Product, } = useProductByKeys();

  useEffect(() => {
    if (id) {
      setData((prev) => ({
        ...prev,
        subcategoryIds: [id], 
      }));
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      ProductByKeys(data);
    }
  }, [data]);

  useEffect(() => {
    setProducts(Product);
  }, [Product]);

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
