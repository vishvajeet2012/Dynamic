export default function qty(){

    return (
        <>


             <div className="flex items-center gap-2 text-sm mt-2">
                        <span className="font-bold text-black">Quantity:</span>
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() =>
                              updateCartItem({
                                productId: product.id,
                                quantity: product.quantity - 1,
                                size: product.size,
                                color: product.color,
                              })
                            }
                            disabled={product.quantity <= 1}
                            className="px-2 py-0.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 bg-white border-x">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItem({
                                productId: product.id,
                                quantity: product.quantity + 1,
                                size: product.size,
                                color: product.color,
                              })
                            }
                            className="px-2 py-0.5 font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </div>
        </>
    )
}