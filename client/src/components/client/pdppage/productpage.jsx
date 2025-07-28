import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa';
import ProductImage from './productImage';
import { useProductDetail } from '../../../hooks/Product/Product';
import AddToCart from '../cartPage/AddToCart';

const ProductPage = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { getProductBySlug, productDetail, loading, error, success } = useProductDetail();
  const { id } = useParams();
  const [selectedSize,SetSelectedSize]=useState()
  useEffect(() => {
    if (id) {
      getProductBySlug(id);
    }
  }, [id]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

        const handleSize =(e)=>{
SetSelectedSize(e)
        }



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
   
        {productDetail?.images && (
          <div className="w-full md:w-1/2">
            <ProductImage
              images={productDetail.images} 
              altText={productDetail.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={handleImageSelect}
            />
          </div>
        )}
        
      
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{productDetail?.name}</h1>
          
      
          {productDetail?.ratings > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {renderRating(productDetail.ratings)}
              </div>
              <span className="text-sm text-gray-600">
                ({productDetail.numOfReviews} reviews)
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold text-gray-900">
              {formatPrice(productDetail?.sellingPrice)}
            </p>
            {productDetail?.discount > 0 && (
              <>
                <p className="text-lg text-gray-500 line-through">
                  {formatPrice(productDetail?.basePrice)}
                </p>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                  {productDetail.discount}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Color Selection */}
          {productDetail?.color && (
            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700">Color: {productDetail.color}</p>
            </div>
          )}
          
          {/* Size Selection */}
          {productDetail?.size && productDetail.size.length > 0 && (
            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700">Available Sizes:</p>
              <div className="flex gap-2 mt-2">
                {productDetail.size.map((size, index) => (
                  <button
                  onClick={()=>handleSize(size)}
                    key={index}
className={`px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 ${
  selectedSize === size ? "bg-primaryReds text-white" : "bg-white text-black"
}`}                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {productDetail?.description}
            </p>
          </div>
          
       
          <div className="pt-2">
            <p className={`text-sm font-medium ${productDetail?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {productDetail?.stock > 0 ? `In Stock (${productDetail.stock} available)` : 'Out of Stock'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="px-4 py-1 text-center w-12">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>

           <AddToCart   productDetail={productDetail}  productId={productDetail?._id} quantity={quantity} size={selectedSize} color={productDetail?.color} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;