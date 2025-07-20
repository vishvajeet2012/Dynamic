'use client'

import { useEffect } from 'react'
import { useGetProduct } from '../hooks/Product/Product'
import ProductCard from './ProductCard'
import { Carousel } from '@/components/ui/carousel'

export default function NewArrivals() {
  const { getProduct, loading, Product } = useGetProduct()

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-black tracking-tight">
          New Arrivals
        </h1>
      </div>

      {/* Mobile View: Carousel */}
      <div className="block lg:hidden">
        <Carousel>
          {Product?.data?.map((product, idx) => (
            <div
              key={idx}
              className="min-w-[80%] sm:min-w-[60%] px-1"
            >
              <ProductCard item={product} />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Desktop View: Grid */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {Product?.data?.map((product, idx) => (
          <ProductCard key={idx} item={product} />
        ))}
      </div>
    </section>
  )
}
