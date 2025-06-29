import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProductCard({ item }) {
  const {
    name,
    category,
    color,
    discount,
    basePrice,
    sellingPrice,
    size,
    images,
  } = item;

  return (
    <Card className="rounded-xl overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
      <div className="relative w-full aspect-square bg-gray-50 group overflow-hidden">
        <img
          src={images?.[0]?.imagesUrls}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white rounded-full px-2.5 py-0.5 text-xs font-medium">
            {discount}% OFF
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2 flex-grow flex flex-col">
        <div className="flex-grow">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
            {name}
          </h2>
          <p className="text-xs text-gray-500 capitalize">{category?.categoryName}</p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
              color.toLowerCase() === "red"
                ? "border-red-500 text-red-500"
                : color.toLowerCase() === "blue"
                ? "border-blue-500 text-blue-500"
                : color.toLowerCase() === "green"
                ? "border-green-500 text-green-500"
                : color.toLowerCase() === "black"
                ? "border-gray-900 text-gray-900"
                : "border-gray-400 text-gray-500"
            )}
          >
            {color}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹{sellingPrice}
          </span>
          {discount > 0 && (
            <span className="text-xs line-through text-gray-400">
              ₹{basePrice}
            </span>
          )}
        </div>

        {size?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {size.map((s, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}