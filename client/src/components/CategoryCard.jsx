import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const CategoryCard = ({ category, priority = false, className = "" }) => {
  return (
    <Link
      to={`/category/${category.type}`}
      className={`group relative overflow-hidden rounded-3xl bg-gray-100 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${className}`}
    >
      <OptimizedImage
        src={category.img}
        alt={category.name}
        width={800}
        height={800}
        priority={priority}
        imgClassName="grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
      />
      
      {/* LUXE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
        <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
          Curated collection
        </span>
        <h3 className="text-white text-4xl font-black uppercase tracking-tighter leading-none mb-4 transform transition-transform duration-500 group-hover:translate-x-2">
          {category.name}
        </h3>
        <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
          View Collection <span className="text-lg">→</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
