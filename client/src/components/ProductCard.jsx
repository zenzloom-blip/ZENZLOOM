import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const ProductCard = ({ product, priority = false }) => {
  return (
    <div className="group relative card-hover">
      {/* IMAGE CONTAINER */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 group">
        <OptimizedImage
          src={product.images[0]}
          alt={product.name}
          width={600}
          height={800}
          priority={priority}
          imgClassName={`group-hover:scale-110 transition-all duration-700 ${(!product.inStock || product.isSold) ? "opacity-60 grayscale-[0.5]" : ""}`}
        />

        {/* HIGH-VISIBILITY STATUS OVERLAY */}
        {(!product.inStock || product.isSold) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/10 transition-all group-hover:bg-black/20">
            <div className="bg-white/90 backdrop-blur-md border border-white/50 px-6 py-3 rounded-2xl shadow-xl transform scale-100 group-hover:scale-110 transition-transform duration-300">
              <span className="text-black text-[11px] font-black uppercase tracking-[0.2em] text-center block leading-none">
                {product.isSold ? "Piece Sold" : "Out of Stock"}
              </span>
            </div>
          </div>
        )}

        {/* OVERLAY ON HOVER (Only for available items) */}
        {product.inStock && !product.isSold && (
          <div className="absolute inset-0 z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
              View Details
            </div>
          </div>
        )}

        {/* PREMIUM BADGE */}
        {product.quality === "premium" && (
          <div className="absolute top-4 left-4 z-30">
            <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black tracking-[0.2em] px-3 py-1.5 rounded-lg uppercase shadow-sm border border-white/50">
              Premium
            </span>
          </div>
        )}
      </Link>

      {/* INFO */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-black">₹{product.price}</p>
        </div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
          {product.category}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
