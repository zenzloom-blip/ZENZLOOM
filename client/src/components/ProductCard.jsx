import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="group relative card-hover">
      {/* IMAGE CONTAINER */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={product.images[0] ? (product.images[0].startsWith("http") ? product.images[0] : `${import.meta.env.VITE_API_URL || ""}${product.images[0]}`) : "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* OVERLAY ON HOVER */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isSold && (
            <span className="bg-black text-white text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase">
              Sold Out
            </span>
          )}
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
