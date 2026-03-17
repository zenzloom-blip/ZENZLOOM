import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiTrash2, FiEdit2, FiPlus, FiX, FiCheckCircle, FiPackage, FiActivity } from "react-icons/fi";

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

  const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/products`;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchProducts(token);
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
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Inventory Status</p>
              <h3 className="text-2xl font-bold text-gray-900">Active</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Cloud Sync</p>
              <h3 className="text-2xl font-bold text-green-500">Connected</h3>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Management</h1>
            <p className="text-gray-500 mt-1">Add, edit, and manage your inventory easily.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              showAddForm ? "bg-gray-200 text-gray-700" : "bg-[#86bd22] text-white shadow-lg shadow-green-200 hover:scale-105 active:scale-95"
            }`}
          >
            {showAddForm ? <><FiX /> <span>Cancel</span></> : <><FiPlus /> <span>Add New Product</span></>}
          </button>
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
                              <img src={url} alt="preview" className="w-full h-full object-cover" />
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

        {/* Product List Section */}
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
              {products.map(product => (
                <div key={product._id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0] ? (product.images[0].startsWith("http") ? product.images[0] : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${product.images[0]}`) : "https://via.placeholder.com/300"}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isSold ? "grayscale" : ""}`}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">₹{product.price}</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${product.quality === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{product.quality}</span>
                      {product.isSold && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">SOLD OUT</span>}
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
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-100"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
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
      </div>
    </div>
  );
};

export default Admin;
