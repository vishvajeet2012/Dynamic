'use client'

import { useEffect } from 'react'
import { useGetProduct } from '../hooks/Product/Product'
import ProductCard from './ProductCard'
import { Carousel } from '@/components/ui/carousel'
import LoadingBar from './loading'
import SkeletonProductCard from './skeltonProductCArd'

export default function NewArrivals({ query, titile }) {
  const { getProduct, loading, Product } = useGetProduct()

  useEffect(() => {
    getProduct(query)
  }, [query])

  return (
    <section className="w-full py-6 lg:px-6">
      {/* Loading Top Bar */}
      {loading && <LoadingBar />}

      {/* Title */}
     <div className="text-xl md:text-center mb-4">
  {loading ? (
    <div className="w-48 h-8 mx-auto bg-gray-300 rounded-md animate-pulse"></div>
  ) : (
    <h1 className="pl-2 md:pl-0 text-xl md:text-4xl font-semibold text-black tracking-tight">
      {titile}
    </h1>
  )}
</div>

      {/* Carousel */}
      <Carousel>
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="min-w-[50%] sm:min-w-[50%] lg:min-w-[19%] px-1 lg:px-1"
              >
             <SkeletonProductCard />
              </div>
            ))
          : Product?.data?.map((product, idx) => (
              <div
                key={idx}
                className="min-w-[50%] sm:min-w-[50%] lg:min-w-[19%] px-1 lg:px-1"
              >
                <ProductCard item={product} />
              </div>
            ))}
      </Carousel>
    </section>
  )
}
