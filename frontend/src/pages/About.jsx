import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaGem, FaBullseye, FaEye, FaHeart, FaTruck, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="About Us"
        subtitle="The story behind Shri Hari Collection"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      <div className="bg-white">
        {/* Brand Story */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Our Story</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Fashion For Every Generation</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Shri Hari Collection was born from a passion for making premium fashion accessible to everyone. Based in the heart of Meerut, Uttar Pradesh, we have been serving families with quality clothing for men, women, and children.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our journey started with a simple belief — that great fashion shouldn't come with a hefty price tag. We carefully curate each piece in our collection, ensuring the finest fabrics, the best craftsmanship, and designs that blend tradition with modern trends.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, we are proud to be a trusted name in fashion for families across India, offering everything from everyday essentials to festive wear and premium accessories.
                </p>
              </div>
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-12 text-center">
                <h3 className="text-5xl font-extrabold text-yellow-400 mb-2">5+</h3>
                <p className="text-gray-300 mb-6">Years of Excellence</p>
                <h3 className="text-5xl font-extrabold text-yellow-400 mb-2">10K+</h3>
                <p className="text-gray-300 mb-6">Happy Customers</p>
                <h3 className="text-5xl font-extrabold text-yellow-400 mb-2">1000+</h3>
                <p className="text-gray-300">Products Delivered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <FaBullseye className="text-2xl text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide premium quality fashion at affordable prices, making every customer feel confident and stylish. We aim to deliver an exceptional shopping experience with honest pricing, genuine products, and outstanding service.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                  <FaEye className="text-2xl text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become India's most trusted fashion destination, where every generation finds their perfect style. We envision a future where quality fashion is accessible to everyone, everywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-yellow-600 font-semibold text-sm uppercase tracking-widest">Why Us</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Why Choose Shri Hari Collection?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FaGem, title: "Premium Quality", desc: "Only the finest fabrics and materials in every product" },
                { icon: FaHeart, title: "Customer First", desc: "Your satisfaction is our top priority, always" },
                { icon: FaTruck, title: "Fast Delivery", desc: "Quick and reliable shipping across India" },
                { icon: FaShieldAlt, title: "Trust & Security", desc: "100% genuine products with secure payments" },
              ].map((item) => (
                <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-yellow-50 transition-colors">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10 mb-4">
                    <item.icon className="text-xl text-yellow-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default About;
