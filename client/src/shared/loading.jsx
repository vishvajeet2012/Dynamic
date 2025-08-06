export default function FullScreenLoader({ productDetailsPage }) {
  // Default spinner styles (same as before)
  const spinnerStyle = {
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #e11b23',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
  };

  const fullScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  if (productDetailsPage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image gallery skeleton */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-gray-200 rounded-lg aspect-square w-full h-96"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-md w-16 h-16"></div>
              ))}
            </div>
          </div>
          
          {/* Product info skeleton */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* Title */}
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            
            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
                ))}
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
            
            {/* Color */}
            <div>
              <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-6 bg-gray-200 rounded"></div>
            </div>
            
            {/* Sizes */}
            <div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <div key={size} className="w-10 h-8 bg-gray-200 rounded-md"></div>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="w-32 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
            </div>
            
            {/* Stock */}
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
            
            {/* Add to cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-200 rounded-md">
                <div className="w-8 h-8 bg-gray-200"></div>
                <div className="w-12 h-8 bg-gray-100"></div>
                <div className="w-8 h-8 bg-gray-200"></div>
              </div>
              <div className="w-32 h-10 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default spinner loader
  return (
    <div style={fullScreenStyle}>
      <div style={spinnerStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}