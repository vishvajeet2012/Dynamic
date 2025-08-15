import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function RoundedCards({ categories = [], loading ,}) {
  const renderCategoryCard = (category, isSkeleton = false, idx = 0) => {
    const cardClass = `group flex flex-col items-center justify-start gap-2 text-center ${
      isSkeleton ? "animate-pulse" : ""
    }`;

    const circleClass = ` w-24 h-24 lg:w-40 lg:h-auto p-1 rounded-full overflow-hidden border-2 ${
      isSkeleton
        ? "border-gray-300 bg-gray-200"
        : "border-gray-200 group-hover:border-primary group-hover:scale-105 transition-all duration-300 ease-in-out"
    }`;

    const textClass = `w-24 text-sm font-medium ${
      isSkeleton
        ? "bg-gray-200 h-4 rounded"
        : "text-gray-700 group-hover:text-primary transition-colors duration-300"
    }`;

    return (
      <div  key={category?._id || idx} className={cardClass}>
        <div className={circleClass}>
          {isSkeleton ? (
            <div className="w-full h-full bg-gray-300  aspect-square rounded-full" />
          ) : (
            <img
              src={category?.childCategoryImage}
              alt={category?.childCategoryName}
              className="w-full h-full lg:h-auto object-cover rounded-full"
            />
          )}
        </div>
        <p className={textClass}>
          {!isSkeleton && category?.childCategoryName}
        </p>
      </div>
    );
  };

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 6 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
  };

  const displayItems = loading
    ? Array.from({ length: 8 })
    : Array.isArray(categories)
    ? categories.slice(0, 8)
    : [];

  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-4 lg:mb-8 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Shop by Category
          </h2>
         
        </div>

        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-8 justify-center">
          {displayItems?.map((category, idx) => (
            <div key={idx} className="flex justify-center">
              {renderCategoryCard(category, loading, idx)}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          {displayItems?.length > 0 && (
            <Carousel
              responsive={responsive}
              infinite
              autoPlay={false}
              arrows={false}
              keyBoardControl={true}
              containerClass="carousel-container"
              itemClass="px-2"
            >
              {displayItems.map((category, idx) => (
                <div key={idx}>{renderCategoryCard(category, loading, idx)}</div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
