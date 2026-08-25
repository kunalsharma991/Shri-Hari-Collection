import { useState } from "react";
import { FaEnvelope, FaCheck } from "react-icons/fa";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
          <FaEnvelope className="text-xl text-yellow-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Stay in the Loop</h2>
        <p className="text-gray-400 mb-8">Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips.</p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-full">
            <FaCheck /> Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
              required
            />
            <button type="submit" className="bg-yellow-500 text-black px-8 py-3.5 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-lg flex-shrink-0">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
