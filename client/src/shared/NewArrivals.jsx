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
    <section className="w-full py-6 px-6">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-semibold text-black tracking-tight">
          New Arrivals
        </h1>
       
      </div>

      <Carousel>
        {Product?.data?.map((product, idx) => (
          <div
            key={idx}
            className="min-w-[17%] sm:min-w-[19%] lg:min-w-[20%] px-2"
          >
            <ProductCard item={product} />
          </div>
        ))}
      </Carousel>
    </section>
  )
}
