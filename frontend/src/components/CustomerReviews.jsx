import { useState } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviews = [
  { name: "Priya Sharma", location: "Meerut", rating: 5, text: "Amazing quality sarees! I ordered a silk saree and it was exactly as shown. The fabric is luxurious and the delivery was super fast. Will definitely order again!", product: "Women's Silk Saree" },
  { name: "Rahul Kumar", location: "Delhi", rating: 5, text: "The shirt quality is outstanding for the price. Perfect fit and the cotton material is very comfortable. Highly recommend Shri Hari Collection!", product: "Premium Men's Shirt" },
  { name: "Anita Gupta", location: "Lucknow", rating: 4, text: "Beautiful kurti with great embroidery work. The fabric is soft and comfortable for daily wear. Received many compliments from friends and family!", product: "Women's Designer Kurti" },
  { name: "Vikash Singh", location: "Meerut", rating: 5, text: "Bought shoes for my daily commute. Very comfortable sole and the leather quality is premium. Worth every rupee spent. Great customer service too!", product: "Men's Casual Shoes" },
];

function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const review = reviews[current];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
        <h2 className="text-4xl font-bold text-gray-900 mt-1 mb-12">What Our Customers Say</h2>

        <div className="relative bg-gray-50 rounded-2xl p-8 sm:p-12">
          <FaQuoteLeft className="text-4xl text-yellow-200 mx-auto mb-4" />

          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
            "{review.text}"
          </p>

          <div className="flex justify-center gap-1 text-yellow-400 mb-3">
            {Array(5).fill(0).map((_, i) => (
              <FaStar key={i} className={`${i < review.rating ? "" : "text-gray-300"}`} />
            ))}
          </div>

          <p className="font-bold text-gray-900">{review.name}</p>
          <p className="text-sm text-gray-500">{review.location} • Purchased: {review.product}</p>

          {/* Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setCurrent((current - 1 + reviews.length) % reviews.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-yellow-500 hover:text-yellow-500 transition">
              <FaChevronLeft className="text-sm" />
            </button>
            <button onClick={() => setCurrent((current + 1) % reviews.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-yellow-500 hover:text-yellow-500 transition">
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;
