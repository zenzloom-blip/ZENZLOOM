import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const test = async () => {
    try {
        console.log("Testing Cloudinary Integration...");
        
        // 1. Login
        console.log("Step 1: Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: "admin",
            password: "admin123"
        });
        const token = loginRes.data.token;
        console.log("Login Success!");

        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                ...new FormData().getHeaders()
            }
        };

        // 2. Upload Product
        console.log("Step 2: Uploading product to Cloudinary...");
        const formData = new FormData();
        formData.append('name', 'Cloudinary Test Product');
        formData.append('description', 'Testing Cloudinary upload');
        formData.append('price', '999');
        formData.append('category', 'shirts');
        formData.append('size', 'M,L');
        formData.append('quality', 'premium');
        
        // Use an existing image file for testing (from uploads if available)
        const testImageDir = 'd:/coding/zenzloom/ZENZLOOM/server/uploads';
        const files = fs.readdirSync(testImageDir);
        if (files.length === 0) {
            console.error("No test images found in uploads folder.");
            process.exit(1);
        }
        
        formData.append('images', fs.createReadStream(path.join(testImageDir, files[0])));

        const uploadRes = await axios.post('http://localhost:5000/api/products', formData, {
            headers: {
                ...config.headers,
                ...formData.getHeaders()
            }
        });

        const createdProduct = uploadRes.data;
        console.log("Product Created!");
        console.log("Image URL:", createdProduct.images[0]);

        if (createdProduct.images[0].includes("cloudinary.com")) {
            console.log("✅ Cloudinary Upload Verified!");
        } else {
            console.error("❌ Failed: Image URL is not from Cloudinary.");
            process.exit(1);
        }

        // 3. Delete Product
        console.log("Step 3: Deleting product and verifying cloud removal...");
        await axios.delete(`http://localhost:5000/api/products/${createdProduct._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Deletion API call successful. Check server logs for Cloudinary destroy confirmation.");

        console.log("\nFULL CLOUDINARY TEST PASSED!");
    } catch (error) {
        console.error("Test Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
};

test();
