// import {useNavigate} from 'react-router-dom';
// function Home() {
//     const navigate = useNavigate();
//   let collection = [
//     { name: "JACKET", img: "jacket.jpg" },
//     { name: "HOODIE", img: "hoodies.jpg" },
//     { name: "SHIRTS", img: "Shirt.png" },
//     { name: "PANTS", img: "Pants.jpg" },
//     { name: "TEES", img: "Tees.jpg" },
//   ];

//   return (
//     <>
//       <h1 className="text-5xl text-center mt-6">
//         Collection
//       </h1>

//       <div className="grid grid-cols-3 h-[calc(100vh-80px)] mt-10 mb-10">
//         {collection.map((item, index) => (
//           <div
//             key={index}
//             onClick={()=>navigate(`/collection/${item.name.toLowerCase()}`)}
//             className="relative flex-1 flex items-center justify-center overflow-hidden group text-black hover:text-white"
//           >
//             {/* Background Image */}
//             <img
//               src={`/${item.img}`}
//               alt={item.name}
//               className="
//                 absolute inset-0
//                 w-full h-full object-cover
//                 opacity-0 group-hover:opacity-100
//                 blur-md
//                 transition-all duration-500
//               "
//             />

//             {/* Dark overlay for readability */}
//             <div className=" absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

//             {/* Text */}
//             <h2 className="relative z-10 text-6xl font-bold ">
//               {item.name}
//             </h2>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default Home;


import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import OptimizedImage from "../components/OptimizedImage";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Hoodies", type: "hoodies", img: "/hoodies.jpg" },
    { name: "T-Shirts", type: "tshirts", img: "/Tees.jpg" },
    { name: "Jeans", type: "jeans", img: "/Pants.jpg" },
    { name: "Shirts", type: "shirts", img: "/Shirt.png" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts(true);
        setProducts(data.slice(0, 4)); // Show only top 4 featured
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="pt-16">
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-black">
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/hero banner.jpg"
            alt="Hero"
            width={1920}
            height={1080}
            priority={true}
            imgClassName="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white pointer-events-none">
          <div className="max-w-2xl pointer-events-auto">
            <span className="inline-block px-4 py-1 mb-6 border border-white/30 rounded-full text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
              Exclusive Thrift Collection
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
              REDEFINE <br />
              <span className="text-outline-white">VINTAGE.</span>
            </h1>
            <p className="max-w-md text-lg text-gray-300 mb-10 font-medium leading-relaxed">
              Discover curated, high-quality thrift pieces that tell a story.
              Sustainable fashion for the modern individual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary bg-white text-black hover:bg-gray-200">
                Shop Now
              </Link>
              <Link to="/shop" className="btn-outline border-white text-white hover:bg-white hover:text-black">
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Browse Categories</h2>
            <p className="text-gray-500 mt-4 text-lg">Find your style in our curated collections.</p>
          </div>
          <Link to="/categories" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition">
            See All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-8 h-auto md:h-[800px]">
          {/* FEATURED: HOODIES (Big) */}
          <CategoryCard 
            category={categories[0]} 
            priority={true} 
            className="md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto" 
          />
          
          {/* T-SHIRTS (Wide) */}
          <CategoryCard 
            category={categories[1]} 
            priority={true} 
            className="md:col-span-2 md:row-span-1 aspect-[4/3] md:aspect-auto" 
          />
          
          {/* JEANS (Small) */}
          <CategoryCard 
            category={categories[2]} 
            priority={true} 
            className="md:col-span-1 md:row-span-1 aspect-square md:aspect-auto" 
          />
          
          {/* SHIRTS (Small) */}
          <CategoryCard 
            category={categories[3]} 
            priority={true} 
            className="md:col-span-1 md:row-span-1 aspect-square md:aspect-auto" 
          />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">New Arrivals</h2>
            <p className="text-gray-500 text-lg">Hand-picked pieces just for you.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                priority={index < 4} // Eager load first row
              />
            ))}
          </div>

          <div className="mt-20 text-center">
            <Link to="/shop" className="btn-outline">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage 
                src="/hoodies.jpg" 
                alt="Sustainability" 
                width={800}
                height={1000}
                imgClassName="grayscale hover:grayscale-0" 
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white text-black p-10 rounded-2xl hidden lg:block">
              <p className="text-4xl font-black leading-tight">100% <br /> Authentic</p>
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-8 leading-tight">
              Sustainable <br /> Fashion First.
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed mb-10">
              We believe in quality over quantity. Every item at Zenzloom is carefully
              inspected and curated to ensure it meets our high standards of style
              and sustainability.
            </p>
            <ul className="space-y-6">
              {[
                "Curated vintage selections",
                "Environmentally conscious",
                "Unique, one-of-a-kind pieces",
                "Premium quality guarantee"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-medium">
                  <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
