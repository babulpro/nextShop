"use client"

import { useParams } from "next/navigation"
import React, { useState, useEffect } from "react"
import { Star, ShoppingBag, Heart, Truck, Shield, RefreshCw, Check } from "lucide-react"

export default function ProductPage() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [isFavorite, setIsFavorite] = useState(false)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [items, setBuyData] = useState({
        productId: "",
        color: "",
        size: "",
        quantity: 1,
        price: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/secrect/product/newProduct/productById?id=${id}`, { cache: "no-store" })
                if (!response.ok) throw new Error("Failed to fetch data")
                const { data } = await response.json()
                setData(data[0])
                
                // Initialize buydata with default values
                const price = data[0]?.discountPercent 
                    ? data[0].price - (data[0].price * data[0].discountPercent / 100)
                    : data[0].price
                
                setBuyData({
                    productId: data[0]?._id || id,
                    color: data[0]?.color?.[0] || "",
                    size: data[0]?.size?.[0] || "",
                    quantity: 1,
                    price: price
                })
                
                setLoading(false)
            }
            catch (e) {
                setError(e.message)
                setLoading(false)
            }
        };
        fetchData()
    }, [id])

    // Update buydata when color changes
    const handleColorChange = (color) => {
        setBuyData(prev => ({
            ...prev,
            color: color
        }))
    }

    // Update buydata when size changes
    const handleSizeChange = (size) => {
        setBuyData(prev => ({
            ...prev,
            size: size
        }))
    }

    // Update buydata when quantity changes
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity)
        setBuyData(prev => ({
            ...prev,
            quantity: newQuantity
        }))
    }

    const increaseQuantity = () => {
        const newQuantity = quantity + 1
        setQuantity(newQuantity)
        setBuyData(prev => ({
            ...prev,
            quantity: newQuantity
        }))
    }

    const decreaseQuantity = () => {
        const newQuantity = quantity > 1 ? quantity - 1 : 1
        setQuantity(newQuantity)
        setBuyData(prev => ({
            ...prev,
            quantity: newQuantity
        }))
    }

    const handleAddToCart = async() => {
       try{
            const config ={
                method:"POST",
                headers:{
                         "Content-type":"application/json"
                        },
                body:JSON.stringify(items)

            }

            const response = await fetch("/api/secrect/product/cart/newCart",config,{cache:"no-cache"})

            if(!response.ok){
                alert("order not placed try again later")
            }
            const json = await response.json()
            if(json.status="success"){
                alert("congratulation to order successfully ")
            }

        }
        catch(e){
            alert("something went wrong")
        }
    }

    const handleBuyNow = async() => {
    
        if (!items.size || !items.color) {
            alert("Please select size and color")
            return
        }

        try{
            const config ={
                method:"POST",
                headers:{
                         "Content-type":"application/json"
                        },
                body:JSON.stringify(items)

            }

            const response = await fetch("/api/secrect/product/order/newOrder",config,{cache:"no-cache"})

            if(!response.ok){
                alert("order not placed try again later")
            }
            const json = await response.json()
            if(json.status="success"){
                alert("congratulation to order successfully ")
            }

        }
        catch(e){
            alert("something went wrong")
        }
        
         
         
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Error: {error || "Product not found"}</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn bg-primary-600 text-white hover:bg-primary-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    // Calculate discounted price
    const discountedPrice = data.discountPercent 
        ? data.price - (data.price * data.discountPercent / 100)
        : data.price

    // Create star rating display
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star 
                key={i} 
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
                            </li>
                            <li>
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </li>
                            <li>
                                <a href="/products" className="text-gray-500 hover:text-gray-700">Products</a>
                            </li>
                            <li>
                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </li>
                            <li className="text-gray-700 font-medium">{data.name}</li>
                        </ol>
                    </nav>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={data.images?.[activeImageIndex] || "/placeholder-image.jpg"}
                                    alt={data.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {data.images?.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {data.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 ${activeImageIndex === index ? 'border-primary-600' : 'border-transparent'}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${data.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Title and Rating */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        {renderStars(data.rating || 0)}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {data.rating || 0} ({data.reviewCount || 0} reviews)
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {data.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${discountedPrice.toFixed(2)}
                                    </span>
                                    {data.discountPercent && (
                                        <>
                                            <span className="text-2xl text-gray-400 line-through">
                                                ${data.price.toFixed(2)}
                                            </span>
                                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                                                -{data.discountPercent}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">Including VAT</p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{data.description}</p>
                            </div>

                            {/* Color Selection */}
                            {data.color?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Color: <span className="text-gray-700">{items.color}</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {data.color.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => handleColorChange(color)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${items.color === color ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div 
                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                />
                                                <span>{color}</span>
                                                {items.color === color && (
                                                    <Check className="w-4 h-4 text-primary-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {data.size?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Size</h3>
                                    <div className="grid grid-cols-5 gap-3">
                                        {data.size.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => handleSizeChange(size)}
                                                className={`py-3 rounded-lg border-2 text-center font-medium ${items.size === size ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {items.size && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Size guide available
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Quantity and Actions */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-3 w-16 text-center font-medium">{items.quantity}</span>
                                        <button
                                            onClick={increaseQuantity}
                                            className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {data.inventory} items available
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center justify-center gap-2 bg-slate-600 text-white py-4 px-6 rounded-xl hover:bg-slate-700 transition-colors font-semibold text-lg"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-lg"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${isFavorite ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                                        {isFavorite ? 'Saved' : 'Save'}
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400">
                                        <RefreshCw className="w-5 h-5" />
                                        Compare
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Free Shipping</h4>
                                        <p className="text-sm text-gray-500">On orders over $50</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Shield className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">2-Year Warranty</h4>
                                        <p className="text-sm text-gray-500">Quality guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t p-8">
                        <div className="max-w-3xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex justify-between">
                                            <span>Category</span>
                                            <span className="font-medium">{data.categoryId}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Type</span>
                                            <span className="font-medium">{data.type}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Inventory</span>
                                            <span className="font-medium">{data.inventory} units</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Featured</span>
                                            <span className="font-medium">{data.featured ? 'Yes' : 'No'}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Shipping & Returns</h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Free standard shipping on orders $50+</li>
                                        <li>• Express delivery available</li>
                                        <li>• 30-day return policy</li>
                                        <li>• Free returns</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section (Optional) */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                    {/* Add related products component here */}
                </div>
            </div>
        </div>
    )
}