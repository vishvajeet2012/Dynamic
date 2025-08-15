import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const ProductImage = ({ images, altText }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const galleryImages = images.map(img => ({
    original: img.imagesUrls,
    thumbnail: img.imagesUrls,
    originalAlt: `${altText} full view`,
    thumbnailAlt: `${altText} thumbnail`,
  }));

  const imageUrls = images?.map(img => img.imagesUrls) || [];
  const hasMultipleImages = imageUrls.length > 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasMultipleImages) return;

      if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => (prev + 1) % imageUrls.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrls.length, hasMultipleImages]);

  const handleOpenGallery = () => {
    setShowGallery(true);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  if (!imageUrls.length) return <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse"></div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Main product image container */}
      <div
        className="relative w-full h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        onClick={handleOpenGallery}
        style={{
          '--bg-image': `url(${imageUrls[selectedImageIndex]})`
        }}
      >
        {/* Blurred background pseudo-element */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `var(--bg-image)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px) saturate(1.5)',
            transform: 'scale(1.1)',
          }}
        ></div>

        {/* Main product image */}
        <img
          src={imageUrls[selectedImageIndex]}
          alt={`${altText} - full view`}
          className="relative z-10 object-contain aspect-[5/6] w-full h-full"
          loading="eager"
        />

        {/* Navigation arrows (optional, as the gallery handles this) */}
        {hasMultipleImages && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevents opening the gallery
                setSelectedImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
              }}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevents opening the gallery
                setSelectedImageIndex(prev => (prev + 1) % imageUrls.length);
              }}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail gallery */}
      {hasMultipleImages && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {imageUrls.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  index === selectedImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`View image ${index + 1} of ${imageUrls.length}`}
              >
                <img
                  src={image}
                  alt={`${altText} thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Fade effect on sides for aesthetic */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      )}

      {/* React Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center">
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold p-2 z-50 hover:text-gray-300 transition-colors"
            onClick={handleCloseGallery}
            aria-label="Close image gallery"
          >
            &times;
          </button>
          <div className="w-11/12 h-5/6">
            <ImageGallery
              items={galleryImages}
              startIndex={selectedImageIndex}
              showPlayButton={false}
              showFullscreenButton={false}
              onSlide={index => setSelectedImageIndex(index)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

ProductImage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imagesUrls: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  ).isRequired,
  altText: PropTypes.string.isRequired,
};

export default ProductImage;