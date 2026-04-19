import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const ProductCard = ({ product, priority = false }) => {
  return (
    <div className="group relative card-hover">
      {/* IMAGE CONTAINER */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
        <OptimizedImage
          src={product.images[0]}
          alt={product.name}
          width={600}
          height={800}
          priority={priority}
          imgClassName={`group-hover:scale-110 transition-all duration-500 ${(!product.inStock || product.isSold) ? "opacity-80 pb-4" : ""}`}
        />

        {/* REFINED OVERLAY FOR UNAVAILABLE ITEMS */}
        {(!product.inStock || product.isSold) && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/5">
            <div className="bg-white/80 backdrop-blur-md border border-white/50 px-5 py-2.5 rounded-full shadow-2xl transform tracking-[0.2em] animate-in zoom-in-90 duration-300">
              <span className="text-black text-[10px] font-black uppercase text-center block">
                {product.isSold ? "Piece Sold" : "Restocking Soon"}
              </span>
            </div>
          </div>
        )}

        {/* OVERLAY ON HOVER (Only for available items) */}
        {product.inStock && !product.isSold && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        )}

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.quality === "premium" && (
            <span className="bg-white text-black text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase shadow-sm">
              Premium
            </span>
          )}
        </div>
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
