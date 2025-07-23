import { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa';
import ProductImage from './productImage';
import { useProductDetail } from '../../../hooks/Product/Product';

const ProductPage = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');
  const {getProductBySlug, productDetail,loading,error,success}= useProductDetail();
  const {id}  = useParams();
  console.log("Product Detail:", id);
  const product = {
    name: "Premium Wireless Headphones",
    price: 199.99,
    description: "Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Built-in microphone",
      "Foldable design"
    ],
    colors: ["Black", "Silver", "Blue"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    rating: 4.5,
    reviews: 128
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  }

      useEffect(() => {


      }, []);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section */}
        <div className="w-full md:w-1/2">
          <ProductImage
            images={product.images} 
            altText={product.name}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={handleImageSelect}
          />
        </div>
        
        {/* Product Details Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(product.rating) ? (
                <FaStar key={i} className="text-yellow-400 w-5 h-5" />
              ) : (
                <FaRegStar key={i} className="text-gray-300 w-5 h-5" />
              )
            ))}
            <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
          </div>
          
          {/* Price */}
          <p className="text-2xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
          
          {/* Color Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Color: <span className="text-gray-900">{selectedColor}</span></p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          {/* Features */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Features:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* Quantity and Add to Cart */}
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
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;