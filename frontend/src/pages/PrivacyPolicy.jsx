import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaShieldAlt } from "react-icons/fa";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <PageHeader title="Privacy Policy" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />
      <div className="bg-white py-16"><div className="max-w-3xl mx-auto px-6 prose prose-gray">
        <div className="flex items-center gap-3 mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <FaShieldAlt className="text-yellow-500 text-xl" />
          <p className="text-sm text-gray-700 !mt-0">Last updated: June 1, 2026</p>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
        <p className="text-gray-600 mb-4">We collect information you provide directly, including your name, email address, mobile number, shipping address, and payment information when you create an account or make a purchase.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">We use your information to process orders, provide customer support, send order updates, improve our services, and personalize your shopping experience.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
        <p className="text-gray-600 mb-4">We do not sell or share your personal information with third parties except as necessary to process your orders (shipping partners, payment gateways) or as required by law.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
        <p className="text-gray-600 mb-4">We implement industry-standard security measures including SSL encryption to protect your personal information and payment data.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
        <p className="text-gray-600 mb-4">We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
        <p className="text-gray-600 mb-4">You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us at 8859000084.</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
        <p className="text-gray-600 mb-4">For any privacy-related concerns, contact us at Pandit Chowk, Bhoodbaral, Meerut, Uttar Pradesh or call 8859000084.</p>
      </div></div>
      <Footer />
    </>
  );
}
export default PrivacyPolicy;
