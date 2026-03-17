import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* BRAND */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter">
              ZENZLOOM
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed">
              Curated thrift finds for the modern, conscious individual.
              Quality pieces that tell a story.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400 transition">
                <img src="/instagram.png" alt="Instagram" className="w-6 h-6 invert" />
              </a>
              <a href="#" className="hover:text-gray-400 transition">
                <img src="/facebook.png" alt="Facebook" className="w-6 h-6 invert" />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/category/hoodies" className="text-gray-400 hover:text-white transition">Hoodies</Link></li>
              <li><Link to="/category/tshirts" className="text-gray-400 hover:text-white transition">T-Shirts</Link></li>
              <li><Link to="/category/jeans" className="text-gray-400 hover:text-white transition">Jeans</Link></li>
              <li><Link to="/category/jackets" className="text-gray-400 hover:text-white transition">Jackets</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Sustainability</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-gray-400 mb-6">Subscribe to get special offers and first look at new drops.</p>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-900 border-none rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white transition"
              />
              <button type="submit" className="btn-primary bg-white text-black py-3">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-medium">
          <p>© {currentYear} ZENZLOOM. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;