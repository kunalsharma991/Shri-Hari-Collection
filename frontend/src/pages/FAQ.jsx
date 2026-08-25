import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const faqs = [
  {
    category: "Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery is available for 2-3 business days in select cities." },
      { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above ₹500 across India." },
      { q: "Can I track my order?", a: "Absolutely! Once your order is shipped, you'll receive a tracking link via SMS and email." },
      { q: "Do you ship internationally?", a: "Currently, we only ship within India. International shipping will be available soon." },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We offer a 7-day easy return policy for all unused products in original condition with tags attached." },
      { q: "How do I initiate a return?", a: "Go to My Orders, select the order, and click 'Return'. Our team will arrange a pickup within 2-3 days." },
      { q: "How long does a refund take?", a: "Refunds are processed within 5-7 business days after we receive the returned product." },
      { q: "Can I exchange a product?", a: "Yes, exchanges are allowed for size or color changes within 7 days of delivery." },
    ],
  },
  {
    category: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI, Debit Cards, Credit Cards, Net Banking, and Cash on Delivery (COD)." },
      { q: "Is COD available?", a: "Yes, Cash on Delivery is available for all orders across India." },
      { q: "Is my payment information secure?", a: "Yes, we use 256-bit SSL encryption and secure payment gateways to protect your information." },
      { q: "Can I use a coupon code?", a: "Yes, enter your coupon code at checkout to avail the discount." },
    ],
  },
  {
    category: "General",
    items: [
      { q: "How do I contact customer support?", a: "You can reach us via phone at 8859000084, WhatsApp, or email. We're available Mon-Sat, 10 AM - 8 PM." },
      { q: "Are the products authentic?", a: "Yes, all products are 100% authentic and sourced directly from verified manufacturers." },
      { q: "Do you have a physical store?", a: "Yes! Visit us at Pandit Chowk, Bhoodbaral, Meerut, Uttar Pradesh." },
    ],
  },
];

function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <>
      <Navbar />
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
      />

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          {faqs.map((section) => (
            <div key={section.category} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaQuestionCircle className="text-yellow-500" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, idx) => {
                  const key = `${section.category}-${idx}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                        {isOpen ? <FaChevronUp className="text-yellow-500 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still Have Questions?</h3>
            <p className="text-gray-500 mb-4">Our support team is here to help</p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-black text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition-all shadow-lg">
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FAQ;
