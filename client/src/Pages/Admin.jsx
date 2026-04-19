import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiTrash2, FiEdit2, FiPlus, FiX, FiCheckCircle, FiPackage, FiActivity, FiDollarSign, FiShoppingBag, FiPlusSquare } from "react-icons/fi";
import OptimizedImage from "../components/OptimizedImage";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "hoodies",
    size: "",
    quality: "good",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Track Cloudinary URLs
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "orders"
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    onlineSales: 0,
    offlineSales: 0
  });

  // Manual Order State
  const [showManualSale, setShowManualSale] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manualCustomer, setManualCustomer] = useState({
    name: "",
    email: "offline@zenzloom.com",
    phone: "",
    address: "Offline Sale",
    city: "Local",
    pincode: "000000"
  });

  const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/products`;
  const ORDERS_API_URL = `${import.meta.env.VITE_API_URL || ""}/api/payment`;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchProducts(token);
      fetchOrders(token);
    }
  }, [navigate]);

  const fetchProducts = async (token) => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (token) => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(ORDERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrent = previewUrls.length;
    
    if (totalCurrent + files.length > 10) {
      alert("You can only upload a maximum of 10 images in total.");
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 IMAGE VALIDATION
    if (!editId && images.length === 0) {
      alert("Please upload at least one image of the product! 🖼️");
      return;
    }

    if (editId && existingImages.length === 0 && images.length === 0) {
      alert("A product must have at least one image! 🖼️");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("size", formData.size);
    data.append("quality", formData.quality);
    
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    // 🔥 Add existing images list for edit reconciliation
    if (editId) {
      data.append("existingImages", JSON.stringify(existingImages));
    }

    const token = localStorage.getItem("adminToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }
      
      resetForm();
      fetchProducts(token);
      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to save product: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStock = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      const { data } = await axios.patch(`${API_URL}/${id}/toggle-stock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(p => p._id === id ? data : p));
    } catch (error) {
      console.error("Error toggling stock:", error);
      alert("Failed to update stock status");
    }
  };

  const handleManualSale = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Select a product first!");
    
    setIsSubmitting(true);
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(`${ORDERS_API_URL}/manual-order`, {
        amount: selectedProduct.price,
        customer: manualCustomer,
        cartItems: [selectedProduct]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Offline sale recorded! 💰");
      setShowManualSale(false);
      setSelectedProduct(null);
      fetchOrders(token);
      fetchProducts(token);
    } catch (error) {
      console.error("Manual sale error:", error);
      alert("Failed to record offline sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "hoodies",
      size: "",
      quality: "good",
    });
    setImages([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      size: Array.isArray(product.size) ? product.size.join(",") : product.size,
      quality: product.quality,
    });
    const productImages = product.images.map(img => img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${img}`);
    setExistingImages(productImages);
    setPreviewUrls(productImages);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const token = localStorage.getItem("adminToken");
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts(token);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Failed to delete product: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl text-[#86bd22]">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Pieces Sold</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Active Inventory</p>
              <h3 className="text-2xl font-bold text-gray-900">{products.filter(p => !p.isSold && p.inStock).length}</h3>
            </div>
          </div>
        </div>
        {/* Action Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-1 bg-gray-200/50 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "revenue" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "products" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "orders" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Orders
            </button>
          </div>
          
          {activeTab === "products" && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowManualSale(true)}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all active:scale-95"
              >
                <FiPlusSquare /> <span>Manual Offline Sale</span>
              </button>
              <button
                onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  showAddForm ? "bg-gray-200 text-gray-700" : "bg-[#86bd22] text-white shadow-lg shadow-green-200 hover:scale-105 active:scale-95"
                }`}
              >
                {showAddForm ? <><FiX /> <span>Cancel</span></> : <><FiPlus /> <span>Add New Product</span></>}
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Form Section */}
        {showAddForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{editId ? "Edit Product Details" : "New Product Entry"}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Vintage Oversized Hoodie"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Describe the product details, fit, and style..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all"
                          placeholder="Price"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quality</label>
                        <select
                          name="quality"
                          value={formData.quality}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all"
                        >
                          <option value="premium">Premium</option>
                          <option value="good">Good</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all"
                        >
                          <option value="hoodies">Hoodies</option>
                          <option value="jeans">Jeans</option>
                          <option value="shirts">Shirts</option>
                          <option value="tshirts">T-shirts</option>
                          <option value="jackets">Jackets</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Sizes (S,M,L...)</label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#86bd22] focus:border-transparent outline-none transition-all"
                          placeholder="e.g. S,M,L"
                        />
                      </div>
                    </div>

                    {/* Image Upload Area */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
                      <div className="relative group">
                        <input
                          type="file"
                          multiple
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-[#86bd22] group-hover:bg-green-50">
                          <FiUpload className="text-gray-400 group-hover:text-[#86bd22] mb-2" size={32} />
                          <p className="text-gray-500 font-medium">Click or drag images to upload</p>
                          <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max 10MB per image, Max 10 images)</p>
                        </div>
                      </div>
                      
                      {/* PREVIEW AREA */}
                      {previewUrls.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-in zoom-in-50 duration-300">
                              {url.startsWith('blob:') ? (
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                              ) : (
                                <OptimizedImage 
                                  src={url} 
                                  alt="preview" 
                                  width={100} 
                                  height={100} 
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  // Find the actual index in new images vs existing images
                                  if (url.startsWith('blob:')) {
                                    // It's a new file
                                    const newFileIndex = previewUrls.slice(0, index).filter(u => u.startsWith('blob:')).length;
                                    setImages(prev => prev.filter((_, i) => i !== newFileIndex));
                                  } else {
                                    // It's an existing Cloudinary image
                                    setExistingImages(prev => prev.filter(u => u !== url));
                                  }
                                  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-10 py-4 bg-[#86bd22] text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center space-x-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>{editId ? <FiEdit2 /> : <FiPlus />} <span>{editId ? "Update Product" : "Confirm & Published Product"}</span></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manual Sale Modal (Simplified) */}
        {showManualSale && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black uppercase">Record Offline Sale</h2>
                  <button onClick={() => { setShowManualSale(false); setSelectedProduct(null); }}><FiX size={24} /></button>
                </div>

                <form onSubmit={handleManualSale} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">1. Select Product</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search product name..." 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                        name="productSearch"
                        autoComplete="off"
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl mt-2 max-h-48 overflow-y-auto z-10 shadow-2xl">
                          {products
                            .filter(p => !p.isSold && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(p => (
                              <div 
                                key={p._id} 
                                onClick={() => { setSelectedProduct(p); setSearchQuery(""); }}
                                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                              >
                                <img src={p.images[0]} className="w-8 h-8 rounded object-cover" />
                                <span className="font-bold">{p.name} - ₹{p.price}</span>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    {selectedProduct && (
                      <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center justify-between border border-green-100">
                        <span className="font-bold text-green-700">Selected: {selectedProduct.name}</span>
                        <FiCheckCircle className="text-green-600" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-bold uppercase tracking-wider">2. Customer Details</label>
                    <input 
                      type="text" 
                      placeholder="Customer Name" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      required
                      onChange={(e) => setManualCustomer({...manualCustomer, name: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Customer Phone (Optional)" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      onChange={(e) => setManualCustomer({...manualCustomer, phone: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !selectedProduct}
                    className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Recording..." : "Mark as Sold Offline"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Main Content Area */}
        {activeTab === "products" ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">Live Inventory</h2>
              <span className="bg-green-100 text-[#86bd22] text-xs font-bold px-2.5 py-1 rounded-full">{products.length} Items</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-[#86bd22] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Fetching your products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage size={40} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2">Your shop is empty. Start adding some products!</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-6 font-bold text-[#86bd22] hover:underline"
                >
                  Add your first product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div key={product._id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <OptimizedImage
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={400}
                        priority={index < 8}
                        imgClassName={`transition-transform duration-500 group-hover:scale-110 ${product.isSold ? "grayscale" : ""}`}
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm w-fit">₹{product.price}</span>
                        <span className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-sm w-fit ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.isSold && <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg w-fit">SOLD OUT</span>}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="w-full flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{product.name}</h3>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-6">
                        <button
                          onClick={() => handleToggleStock(product._id)}
                          title={product.inStock ? "Mark as Out of Stock" : "Mark as In Stock"}
                          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold transition-all border ${
                            product.inStock 
                              ? "bg-white text-gray-700 border-gray-100 hover:bg-gray-50" 
                              : "bg-green-50 text-[#86bd22] border-green-100 hover:bg-green-100"
                          }`}
                        >
                          {product.inStock ? <FiX size={16} /> : <FiCheckCircle size={16} />}
                          <span>{product.inStock ? "Out of Stock" : "Set In Stock"}</span>
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 text-red-100 hover:text-red-500 transition-colors"
                          title="Delete Product"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "orders" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2.5 py-1 rounded-full">{orders.length} Completed</span>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
                <FiPackage size={40} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No paid orders yet</h3>
                <p className="text-gray-500 mt-2">Orders will appear here once customers complete their payments.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-black uppercase text-gray-400">Order #{order._id.slice(-8)}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${order.orderType === 'offline' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {order.orderType === 'offline' ? 'OFFLINE SALE' : 'PAID ONLINE'}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{order.customer.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{order.customer.email} • {order.customer.phone}</p>
                        <p className="text-xs text-gray-400 mt-1 italic">{order.customer.address}, {order.customer.city} ({order.customer.pincode})</p>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="relative group/item">
                            <OptimizedImage 
                              src={item.image} 
                              alt={item.name} 
                              width={100}
                              height={100}
                              className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm"
                            />
                            <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity flex-col">
                              <span>₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="lg:text-right min-w-[120px]">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Value</p>
                        <p className="text-2xl font-black text-black">₹{order.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* REVENUE ANALYTICS TAB */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* REVENUE BREAKDOWN */}
                <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Revenue Breakdown</h3>
                   <div className="space-y-8">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Online Sales</p>
                            <h4 className="text-3xl font-black">₹{stats.onlineSales.toLocaleString()}</h4>
                         </div>
                         <span className="text-xs font-bold text-green-500">Razorpay</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[#86bd22]" 
                           style={{ width: `${(stats.onlineSales / stats.totalRevenue) * 100 || 0}%` }}
                         />
                      </div>
                      
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Offline Sales</p>
                            <h4 className="text-3xl font-black">₹{stats.offlineSales.toLocaleString()}</h4>
                         </div>
                         <span className="text-xs font-bold text-blue-500">Manual</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-blue-500" 
                           style={{ width: `${(stats.offlineSales / stats.totalRevenue) * 100 || 0}%` }}
                         />
                      </div>
                   </div>
                </div>

                {/* BUSINESS HEALTH */}
                <div className="bg-black text-white p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">Business Health</h3>
                      <p className="text-6xl font-black tracking-tighter mb-4">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-gray-400 font-medium">Gross revenue generated across all channels. Sustainable growth is visible.</p>
                      
                      <div className="mt-12 grid grid-cols-2 gap-4">
                         <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Average Order</p>
                            <p className="text-xl font-black">₹{Math.round(stats.totalRevenue / stats.totalOrders || 0)}</p>
                         </div>
                         <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Pieces</p>
                            <p className="text-xl font-black">{stats.totalOrders}</p>
                         </div>
                      </div>
                   </div>
                   {/* Decorative circle */}
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#86bd22] rounded-full blur-[100px] opacity-20" />
                </div>
             </div>

             {/* MANUAL SALES INFO */}
             <div className="bg-gray-100 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-bold">Have an offline sale?</h4>
                  <p className="text-gray-500">Manually record it to keep your inventory and revenue data accurate.</p>
                </div>
                <button 
                  onClick={() => setShowManualSale(true)}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Create Manual Entry
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
