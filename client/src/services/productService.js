import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/products`;

if (!import.meta.env.VITE_API_URL && import.meta.env.MODE === 'production') {
  console.error("❌ VITE_API_URL is missing! API calls will fail. Set it in your deployment dashboard.");
}

export const fetchAllProducts = async (availableOnly = false) => {
  const response = await axios.get(`${API_URL}${availableOnly ? "?available=true" : ""}`);
  return response.data;
};

export const fetchProductsByCategory = async (category, availableOnly = false) => {
  const response = await axios.get(`${API_URL}/category/${category}${availableOnly ? "?available=true" : ""}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

