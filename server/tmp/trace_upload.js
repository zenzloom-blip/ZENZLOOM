import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const test = async () => {
    try {
        console.log("Starting Product Creation Trace...");
        
        // 1. Login
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: "admin",
            password: "admin123"
        });
        const token = loginRes.data.token;
        console.log("Logged in successfully.");

        // 2. Prepare Form Data
        const formData = new FormData();
        formData.append('name', 'Trace Test Product');
        formData.append('description', 'Detailed trace of upload problem');
        formData.append('price', '123');
        formData.append('category', 'hoodies');
        formData.append('size', 'L');
        formData.append('quality', 'good');
        
        const testImageDir = 'd:/coding/zenzloom/ZENZLOOM/server/uploads';
        const files = fs.readdirSync(testImageDir);
        if (files.length > 0) {
            formData.append('images', fs.createReadStream(path.join(testImageDir, files[0])));
            console.log("Attaching image:", files[0]);
        } else {
            console.log("No images found in uploads, trying to create one...");
            fs.writeFileSync(path.join(testImageDir, 'dummy.jpg'), 'dummy content');
            formData.append('images', fs.createReadStream(path.join(testImageDir, 'dummy.jpg')));
        }

        console.log("Sending POST request to /api/products...");
        const response = await axios.post('http://localhost:5000/api/products', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        console.log("Response Status:", response.status);
        console.log("Response Body:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("TRACE FAILED");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
};

test();
