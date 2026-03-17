import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts(true);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            <Link to="/" className="hover:text-black transition">Home</Link>
            <span>/</span>
            <span className="text-black">Shop All</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Shop All</h1>
        </div>
        <p className="text-gray-500 font-medium">
          Showing {products.length} unique pieces
        </p>
      </div>

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Our catalog is currently empty.</h2>
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

export default Shop;
