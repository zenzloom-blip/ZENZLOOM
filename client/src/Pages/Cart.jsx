import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="pt-40 pb-24 px-6 text-center max-w-lg mx-auto">
                <div className="text-6xl mb-8">🛒</div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-10 font-medium">Looks like you haven't claimed any unique pieces yet.</p>
                <Link to="/" className="btn-primary inline-block">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Your Bag</h1>
                <button 
                    onClick={clearCart}
                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition"
                >
                    Clear All Items
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* ITEMS LIST */}
                <div className="lg:col-span-2 space-y-8">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-gray-50 rounded-3xl group transition-all hover:bg-white hover:shadow-xl"
                        >
                            <Link to={`/product/${item._id}`} className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden shadow-sm">
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                            </Link>

                            <div className="flex-1 text-center sm:text-left">
                                <Link to={`/product/${item._id}`} className="text-xl font-black uppercase tracking-tight hover:text-gray-600 transition">
                                    {item.name}
                                </Link>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{item.category}</p>
                                <p className="text-lg font-black mt-2">₹{item.price}</p>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Remove Item"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div className="bg-black text-white p-10 rounded-3xl shadow-2xl">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Order Summary</h2>
                        
                        <div className="space-y-4 border-b border-white/10 pb-8 mb-8">
                            <div className="flex justify-between text-gray-400 font-medium">
                                <span>Subtotal</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-400">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-2xl font-black mb-10">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>

                        <Link
                            to="/checkout"
                            className="btn-primary bg-white text-black w-full text-center inline-block py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-200"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>

                    {/* PERKS */}
                    <div className="p-8 border-2 border-gray-100 rounded-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🛡️</span>
                            <p className="text-xs font-black uppercase tracking-widest">Secure Checkout</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">♻️</span>
                            <p className="text-xs font-black uppercase tracking-widest">Sustainable Choice</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
