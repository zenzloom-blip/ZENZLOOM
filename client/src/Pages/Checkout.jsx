import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
    const { cartItems } = useCart();
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price,
        0
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handlePayment = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "";
            // Create order in backend
            const res = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
                amount: totalAmount,
                customer,
                cartItems
            });

            const order = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Zenzloom",
                description: "Thrift Store Purchase",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const API_BASE_URL = import.meta.env.VITE_API_URL || "";
                        // Verify payment in backend
                        await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        alert("Payment Successful 🎉 Order placed.");
                        window.location.href = "/";
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                  name: customer.name,
                  email: customer.email,
                  contact: customer.phone
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("❌ Payment Initiation Failed!");
            if (error.response) {
                console.error("Server Response Data:", error.response.data);
                console.error("Server Status:", error.response.status);
            } else {
                console.error("Error Message:", error.message);
            }
            alert(`Failed to initiate payment: ${error.response?.data?.message || error.message}`);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-24 px-6 text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                    Your cart is empty
                </h2>
                <a href="/shop" className="btn-primary inline-block">Go Shopping</a>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
            <div className="flex-1 space-y-12">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Checkout</h1>
                
                {/* Shipping Form */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest border-b pb-4">Shipping Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="name" placeholder="Full Name" className="checkout-input" onChange={handleInputChange} value={customer.name} required />
                        <input name="email" placeholder="Email Address" className="checkout-input" onChange={handleInputChange} value={customer.email} required />
                        <input name="phone" placeholder="Phone Number" className="checkout-input" onChange={handleInputChange} value={customer.phone} required />
                        <input name="city" placeholder="City" className="checkout-input" onChange={handleInputChange} value={customer.city} required />
                        <input name="pincode" placeholder="Pincode" className="checkout-input" onChange={handleInputChange} value={customer.pincode} required />
                        <input name="address" placeholder="Complete Address" className="checkout-input md:col-span-2" onChange={handleInputChange} value={customer.address} required />
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[400px] space-y-8">
                <div className="bg-gray-50 p-8 rounded-3xl space-y-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Order Summary</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                                <span className="font-medium text-sm text-gray-700">{item.name}</span>
                                <span className="font-bold">₹{item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-black">₹{totalAmount}</span>
                    </div>
                    
                    <button
                        onClick={handlePayment}
                        className="w-full btn-primary bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.pincode}
                    >
                        Complete Order
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest italic">
                        Secure SSL Encryption
                    </p>
                </div>
            </div>

            <style>{`
                .checkout-input {
                    @apply w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black transition;
                    border: 1px solid #eee;
                }
            `}</style>
        </div>
    );
};

export default Checkout;
