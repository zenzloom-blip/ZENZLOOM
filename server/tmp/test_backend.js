import axios from 'axios';

const test = async () => {
    try {
        console.log("Testing Login...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: "admin",
            password: "admin123"
        });
        console.log("Login Success! Token received.");

        console.log("Testing Order Creation...");
        const orderRes = await axios.post('http://localhost:5000/api/payment/create-order', {
            amount: 100,
            customer: {
                name: "Test User",
                email: "test@test.com",
                phone: "1234567890",
                address: "123 Test St",
                city: "Mumbai",
                pincode: "400001"
            },
            cartItems: [
                {
                    _id: "615bb55b5b5b5b5b5b5b5b5b",
                    name: "Test Item",
                    price: 100,
                    images: ["/uploads/test.jpg"]
                }
            ]
        });
        console.log("Order Creation Success! Razorpay Order ID:", orderRes.data.id);
        
        console.log("All backend tests passed!");
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
