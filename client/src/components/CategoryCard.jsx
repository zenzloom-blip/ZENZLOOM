import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const CategoryCard = ({ category, priority = false }) => {
  return (
    <Link
      to={`/category/${category.type}`}
      className="group relative h-[400px] overflow-hidden rounded-2xl bg-gray-200 card-hover"
    >
      <OptimizedImage
        src={category.img}
        alt={category.name}
        width={800}
        height={400}
        priority={priority}
        imgClassName="group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
        <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
          {category.name}
        </h3>
        <span className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          Explore Collection
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
