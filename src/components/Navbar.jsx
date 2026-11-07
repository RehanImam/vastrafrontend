import { useState, useCallback } from "react";
import { Menu, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Logo import from assets
import logoImg from "../assets/logo.jpeg";

const Navbar = ({ onOpenCart }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartCount, wishlist, openCartDrawer } = useCart();

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      openCartDrawer();
    }
  };

  const executeSearch = useCallback(
    (queryToSearch) => {
      const q = (queryToSearch || searchQuery).trim();
      if (q) {
        navigate(`/shop?search=${encodeURIComponent(q)}`);
        setMenuOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate]
  );

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fff8fa]/95 backdrop-blur-md border-b border-pink-200/60 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-rose-950 p-1.5 rounded-lg hover:bg-pink-100/50 transition"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-pink-300 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img
                src={logoImg}
                alt="Vastra official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-rose-950 group-hover:text-rose-800 transition">
                VASTRA
              </span>
              <span className="text-[9px] tracking-[3px] font-medium text-pink-600 uppercase -mt-1">
                OFFICAIL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-rose-950">
            <Link
              to="/"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Shop
            </Link>

            <Link
              to="/shop?category=Saree"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Saree
            </Link>

            <Link
              to="/shop?category=Suit"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Suit
            </Link>

            <Link
              to="/about"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              About
            </Link>
          </nav>

        </div>

        {/* Mobile Nav Drawer + Login/Signup Buttons */}
        {menuOpen && (
          <div className="lg:hidden pb-5">
            {/* Mobile Search Bar inside Drawer */}
            <form
              onSubmit={handleSearchFormSubmit}
              className="relative my-3 flex items-center bg-pink-50 rounded-full border border-pink-200 px-3 py-2"
            >
              <Search size={16} className="text-rose-700 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-rose-950 text-xs outline-none w-full placeholder:text-rose-400"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ml-1"
                >
                  Go
                </button>
              )}
            </form>

            <nav className="flex flex-col gap-2 pt-2 border-t border-pink-200/60 font-medium text-rose-950 text-sm">
              <Link
                onClick={() => setMenuOpen(false)}
                to="/"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Home
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Shop
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop?category=Kurti"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Kurti
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop?category=Sharara"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Sharara
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/about"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                About
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/wishlist"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition flex justify-between items-center"
              >
                <span>Wishlist</span>
                {wishlist?.length > 0 && (
                  <span className="bg-rose-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleOpenCart();
                }}
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition flex justify-between items-center text-left w-full"
              >
                <span>Shopping Bag</span>
                {cartCount > 0 && (
                  <span className="bg-rose-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Auth CTA Buttons */}
              <div className="pt-3 mt-2 border-t border-pink-200/60 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-rose-900 text-white font-semibold text-xs rounded-xl shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-pink-100 text-rose-950 font-semibold text-xs rounded-xl border border-pink-200"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;