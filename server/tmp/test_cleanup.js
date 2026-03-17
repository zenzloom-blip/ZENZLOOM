import axios from 'axios';
import fs from 'fs';
import path from 'path';

const test = async () => {
    try {
        console.log("Testing Login...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: "admin",
            password: "admin123"
        });
        const token = loginRes.data.token;
        console.log("Login Success!");

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 1. Check current uploads
        const uploadsDir = 'd:/coding/zenzloom/ZENZLOOM/server/uploads';
        const filesBefore = fs.readdirSync(uploadsDir);
        console.log("Files before:", filesBefore.length);

        // 2. Fetch products to get one to delete
        const productsRes = await axios.get('http://localhost:5000/api/products');
        const products = productsRes.data;
        
        if (products.length > 0) {
            const productToDelete = products[0];
            console.log(`Deleting product: ${productToDelete.name} (${productToDelete._id})`);
            
            // Check if it has images
            if (productToDelete.images && productToDelete.images.length > 0) {
                console.log("Images to delete:", productToDelete.images);
                
                await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`, config);
                console.log("Product deleted via API.");

                // Wait a bit for file system to catch up
                await new Promise(resolve => setTimeout(resolve, 1000));

                const filesAfter = fs.readdirSync(uploadsDir);
                console.log("Files after:", filesAfter.length);
                
                if (filesAfter.length < filesBefore.length || productToDelete.images.every(img => !fs.existsSync(path.join('d:/coding/zenzloom/ZENZLOOM/server', img)))) {
                    console.log("Image cleanup verified!");
                } else {
                    console.warn("Image cleanup might have failed or product had no local images.");
                }
            } else {
                console.log("Product has no images to clean up.");
            }
        }

        console.log("Cleanup test finished.");
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
