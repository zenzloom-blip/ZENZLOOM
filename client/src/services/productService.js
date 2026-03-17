import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`;

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

