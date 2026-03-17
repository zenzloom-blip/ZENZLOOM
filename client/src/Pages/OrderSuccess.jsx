import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A";

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-500">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
            <FiCheckCircle size={48} />
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-black">
          Order Secured! 🎉
        </h1>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Your unique thrift find is being prepared for its new home. We've sent the details to your email.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID:</span>
            <span className="text-sm font-bold text-black font-mono">#{orderId.slice(-8)}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">A receipt has been registered to our system.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/shop"
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-xl active:scale-95"
          >
            <FiShoppingBag />
            Keep Shopping
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-gray-500 hover:text-black transition"
          >
            Back to Home
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
