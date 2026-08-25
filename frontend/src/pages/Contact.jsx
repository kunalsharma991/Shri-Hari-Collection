import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaCheck, FaClock } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }, 4000);
  };

  return (
    <>
      <Navbar />
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ─── Contact Info Cards ─── */}
            <div className="space-y-4">
              {[
                { icon: FaMapMarkerAlt, title: "Visit Our Store", lines: ["Pandit Chowk, Bhoodbaral", "Meerut, Uttar Pradesh"] },
                { icon: FaPhone, title: "Call Us", lines: ["+91 8859000084", "Mon-Sat: 10 AM - 8 PM"] },
                { icon: FaWhatsapp, title: "WhatsApp", lines: ["+91 8859000084", "Quick response guaranteed"] },
                { icon: FaClock, title: "Working Hours", lines: ["Mon - Sat: 10 AM - 8 PM", "Sunday: 11 AM - 6 PM"] },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4 hover:bg-yellow-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.lines.map((line, i) => <p key={i} className="text-sm text-gray-600">{line}</p>)}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/918859000084"
                target="_blank"
                rel="noreferrer"
                className="block bg-green-500 text-white rounded-2xl p-5 text-center font-semibold hover:bg-green-600 transition-all"
              >
                <FaWhatsapp className="inline-block mr-2 text-xl" />
                Chat on WhatsApp
              </a>
            </div>

            {/* ─── Contact Form ─── */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <FaCheck className="text-3xl text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                      <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                      <input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-yellow-500 focus:bg-white focus:outline-none transition-all resize-none" />
                  </div>
                  <button type="submit" className="bg-black text-yellow-400 px-8 py-3.5 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ─── Google Maps ─── */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.123456789!2d77.7!3d28.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMeerut!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
