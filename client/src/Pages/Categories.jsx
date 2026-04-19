import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import OptimizedImage from "../components/OptimizedImage";

const Categories = () => {
  const categories = [
    { name: "Hoodies", type: "hoodies", img: "/hoodies.jpg" },
    { name: "T-Shirts", type: "tshirts", img: "/Tees.jpg" },
    { name: "Jeans", type: "jeans", img: "/Pants.jpg" },
    { name: "Shirts", type: "shirts", img: "/Shirt.png" },
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 sm:mb-16 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 sm:mb-4">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <span>/</span>
            <span className="text-black">Categories</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Collections</h1>
        </div>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          Explore our {categories.length} curated categories
        </p>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {categories.map((cat) => (
          <div key={cat.type} className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 shadow-2xl transition hover:-translate-y-2 duration-500">
            <Link to={`/category/${cat.type}`} className="block w-full h-full relative">
              <OptimizedImage 
                src={cat.img} 
                alt={cat.name} 
                width={800}
                height={1000}
                imgClassName="grayscale group-hover:grayscale-0 group-hover:scale-110" 
              />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20 text-white">
                  <span className="inline-block px-3 py-1 mb-2 sm:mb-4 border border-white/30 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    Curated Collection
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-2 sm:mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {cat.name}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    View Pieces
                    <span className="text-lg sm:text-xl">→</span>
                  </div>
                </div>
            </Link>
          </div>
        ))}
      </div>

      {/* FOOTER CALLOUT */}
      <div className="mt-32 p-16 bg-black rounded-3xl text-center text-white overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-transparent"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                Can't find what you're looking for?
            </h3>
            <p className="text-gray-400 text-lg font-medium">
                Our inventory is updated daily. Check out our full shop for the latest unique finds.
            </p>
            <div className="pt-4">
                <Link to="/shop" className="btn-primary bg-white text-black hover:bg-gray-200">
                    Browse All Shop
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
