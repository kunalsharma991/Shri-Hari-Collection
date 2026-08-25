import { useNavigate } from "react-router-dom";
import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from "react-icons/fa";

function PromoSection() {
  const navigate = useNavigate();

  const features = [
    { icon: FaTruck, title: "Free Shipping", desc: "On orders above ₹500" },
    { icon: FaUndo, title: "Easy Returns", desc: "7-day return policy" },
    { icon: FaShieldAlt, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: FaHeadset, title: "24/7 Support", desc: "Call us anytime" },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center text-white">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-3">
                <f.icon className="text-xl text-yellow-400" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black">Summer Sale is Live!</h3>
            <p className="text-black/70 mt-1">Up to 40% off on selected items. Use code: <strong className="text-black">SUMMER40</strong></p>
          </div>
          <button onClick={() => navigate("/products")} className="bg-black text-yellow-400 px-8 py-3.5 rounded-full font-bold hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-lg flex-shrink-0">
            Shop Sale
          </button>
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
