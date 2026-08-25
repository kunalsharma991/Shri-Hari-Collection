import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    title: "Premium Fashion Collection",
    subtitle: "Discover the latest trends in men's, women's & kids' fashion",
    cta: "Shop Now",
    bg: "from-black via-gray-900 to-black",
  },
  {
    title: "New Season Arrivals",
    subtitle: "Fresh styles just dropped — be the first to wear them",
    cta: "Explore New",
    bg: "from-gray-900 via-black to-gray-900",
  },
  {
    title: "Flat 30% Off on Sarees",
    subtitle: "Elegant silk sarees for every occasion — limited time offer",
    cta: "Grab Now",
    bg: "from-black via-gray-800 to-black",
  },
];

function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <section className={`relative min-h-[85vh] bg-gradient-to-r ${slides[current].bg} text-white flex items-center overflow-hidden transition-all duration-700`}>
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="max-w-2xl">
          {/* Slide indicator */}
          <span className="inline-block text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-4">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in">
            {slides[current].title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg">
            {slides[current].subtitle}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {slides[current].cta}
            </button>
            <button
              onClick={() => navigate("/about")}
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all z-10">
        <FaChevronLeft />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all z-10">
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-yellow-500" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
