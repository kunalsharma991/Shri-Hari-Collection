import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

function Terms() {
  return (
    <>
      <Navbar />
      <PageHeader title="Terms & Conditions" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Terms & Conditions" }]} />
      <div className="bg-white py-16"><div className="max-w-3xl mx-auto px-6">
        <p className="text-sm text-gray-500 mb-8 p-4 bg-gray-50 rounded-xl">Last updated: June 1, 2026</p>
        {[
          { title: "1. Acceptance of Terms", text: "By accessing and using Shri Hari Collection website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services." },
          { title: "2. Products & Pricing", text: "All product descriptions, images, and prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise." },
          { title: "3. Orders & Payment", text: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be made at the time of order placement. We accept UPI, cards, net banking, and COD." },
          { title: "4. Account Responsibility", text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
          { title: "5. Intellectual Property", text: "All content on this website including text, images, logos, and designs is the property of Shri Hari Collection and is protected by copyright laws." },
          { title: "6. Limitation of Liability", text: "Shri Hari Collection shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services." },
          { title: "7. Governing Law", text: "These terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Meerut, Uttar Pradesh." },
        ].map((item) => (
          <div key={item.title} className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div></div>
      <Footer />
    </>
  );
}
export default Terms;
