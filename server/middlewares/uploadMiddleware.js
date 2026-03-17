import multer from "multer";
import { storage } from "../config/cloudinary.js";

console.log("⚙️ INITIALIZING MULTER WITH 100MB LIMIT");
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

export default upload;
