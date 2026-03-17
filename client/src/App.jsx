// import { useState } from 'react'
// import Home from './Pages/Home.jsx'
// import Navbar from './components/Navbar.jsx'
// import Footer from './components/Footer.jsx'
// import Collection from './Pages/Category.jsx';
// import { BrowserRouter, Routes , Route } from 'react-router-dom'

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar/>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/collection/:category" element={<Collection />} />
//       </Routes>
//       <Footer/>
//     </BrowserRouter>
//   )
// }

// export default App

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App = () => {
  return( 
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
