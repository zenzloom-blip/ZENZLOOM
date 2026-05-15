import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import AuthModal from "./components/AuthModal";
import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      // Show the auth modal after 5 seconds for unauthenticated users
      const timer = setTimeout(() => setShowAuth(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  return( 
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />

      {/* Auth Modal — appears after 5 seconds if user is not logged in */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;

