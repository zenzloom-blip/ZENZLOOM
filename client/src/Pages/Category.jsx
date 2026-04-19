// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import ProductCard from "../components/ProductCard";

// function Category() {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:5000/products?category=${category}`)
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.error(err));
//   }, [category]);

//   return (
//     <div className="p-8">
//       <h1 className="text-4xl font-bold mb-6 capitalize">
//         {category} Collection
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Category;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Category = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsByCategory(type, true);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load category", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [type]);

  if (loading) return <Loader />;

  return (
    <div className="pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 sm:mb-16 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 sm:mb-4">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <span>/</span>
            <span className="text-black capitalize">{type}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{type}</h1>
        </div>
        <p className="text-gray-500 font-medium">
          Showing {products.length} unique pieces
        </p>
      </div>

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">No pieces found in this category.</h2>
          <Link to="/" className="btn-outline">Go Back Home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
