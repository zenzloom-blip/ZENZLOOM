import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import OptimizedImage from "../components/OptimizedImage";
import { optimizeCloudinaryUrl, getImageUrl } from "../utils/imageUtils";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart, cartItems } = useCart();
    const [selectedImage, setSelectedImage] = useState("");
    const [zoomStyle, setZoomStyle] = useState({});
    const [isZooming, setIsZooming] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        // Use a high-quality but manageable image for zoom
        const zoomedImage = optimizeCloudinaryUrl(selectedImage, { width: 1200, quality: "auto" });

        setZoomStyle({
            backgroundImage: `url(${zoomedImage})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: "200%",
        });
    };

    useEffect(() => {
        const loadProduct = async () => {
            const data = await fetchProductById(id);
            setProduct(data);
            if (data.images && data.images.length > 0) {
                setSelectedImage(getImageUrl(data.images[0]));
            }
        };
        loadProduct();
    }, [id]);

    if (!product) return <Loader />;

    const isInCart = cartItems.some((item) => item._id === product._id);

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* BREADCRUMBS */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-12">
                <Link to="/" className="hover:text-black transition">Home</Link>
                <span>/</span>
                <Link to={`/category/${product.category}`} className="hover:text-black transition">{product.category}</Link>
                <span>/</span>
                <span className="text-black">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* LEFT: IMAGES */}
                <div className="space-y-6">
                    <div
                        className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden cursor-zoom-in relative group shadow-inner"
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <div className="w-full h-full relative">
                            {/* Base Image (Always there) */}
                            <OptimizedImage 
                                src={selectedImage} 
                                alt={product.name} 
                                width={800} // Reduced for faster initial load
                                height={1000}
                                className={`w-full h-full transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                            />

                            {/* Zoom Overlay (Fades in) */}
                            <div 
                                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isZooming ? 'opacity-100' : 'opacity-0'}`}
                                style={isZooming ? zoomStyle : {}} 
                            />
                        </div>
                        
                        {/* QUALITY BADGE */}
                        <div className="absolute top-6 left-6">
                            <span className="bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                                {product.quality} Quality
                            </span>
                        </div>
                    </div>

                    {/* THUMBNAILS */}
                    <div className="flex gap-4">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(getImageUrl(img))}
                                className={`aspect-square w-24 rounded-2xl overflow-hidden border-2 transition-all ${
                                    selectedImage === getImageUrl(img) ? "border-black scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <OptimizedImage 
                                    src={img} 
                                    alt={`view-${index}`} 
                                    width={200}
                                    height={200}
                                    className="w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: INFO */}
                <div className="lg:sticky lg:top-32 space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-black">₹{product.price}</p>
                            {product.isSold ? (
                                <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Sold Out</span>
                            ) : (
                                <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Only 1 in Stock</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="prose prose-sm text-gray-500 font-medium leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* SIZE SELECTOR (MOCK) */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-black uppercase tracking-widest">Available Sizes</h4>
                            <div className="flex gap-3">
                                {product.size.map((s) => (
                                    <span key={s} className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-xl text-sm font-black uppercase">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.isSold || isInCart}
                            className={`flex-1 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                product.isSold || isInCart
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800 hover:shadow-2xl active:scale-95"
                            }`}
                        >
                            {product.isSold ? "Piece Sold" : isInCart ? "In Your Cart" : "Claim This Piece"}
                        </button>
                        
                        {/* <button className="p-5 border-2 border-gray-100 rounded-2xl hover:border-black transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button> */}
                    </div>

                    {/* TRUST BADGES */}
                    <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-100">
                        {[
                            { label: "Eco Friendly", icon: "🌱" },
                            { label: "Fast Shipping", icon: "⚡" },
                            { label: "Verified Quality", icon: "✓" }
                        ].map((badge) => (
                            <div key={badge.label} className="text-center space-y-2">
                                <span className="text-2xl">{badge.icon}</span>
                                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{badge.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
