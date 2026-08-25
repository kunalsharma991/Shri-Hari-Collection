import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Shri Hari Collection</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Fashion For Every Generation. Premium quality fashion for men, women, and kids at affordable prices.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-black transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/products" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "My Account", to: "/profile" },
                { label: "My Orders", to: "/my-orders" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-yellow-400 transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-bold text-white mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Return & Refund", to: "/return-policy" },
                { label: "Shipping Policy", to: "/shipping-policy" },
                { label: "FAQ", to: "/faq" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-yellow-400 transition">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-yellow-500 mt-0.5 flex-shrink-0" />
                Pandit Chowk, Bhoodbaral, Meerut, Uttar Pradesh
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-yellow-500 flex-shrink-0" />
                <a href="tel:8859000084" className="hover:text-yellow-400 transition">8859000084</a>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-500 flex-shrink-0" />
                <a href="mailto:info@shriharicollection.com" className="hover:text-yellow-400 transition">info@shriharicollection.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Shri Hari Collection. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-yellow-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-yellow-400 transition">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-yellow-400 transition">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
