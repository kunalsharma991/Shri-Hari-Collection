import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaTruck } from "react-icons/fa";

function ShippingPolicy() {
  return (
    <>
      <Navbar />
      <PageHeader title="Shipping Policy" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shipping Policy" }]} />
      <div className="bg-white py-16"><div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <FaTruck className="text-yellow-500 text-xl" />
          <p className="text-sm text-gray-700 !mt-0">Free shipping on all orders above ₹500</p>
        </div>
        {[
          { title: "Shipping Areas", text: "We ship to all major cities and towns across India. Currently, we do not offer international shipping." },
          { title: "Delivery Timeframes", text: "Standard Shipping: 5-7 business days. Express Shipping: 2-3 business days (available in select cities for an additional charge). Remote areas may take 7-10 business days." },
          { title: "Shipping Charges", text: "Orders above ₹500 qualify for free standard shipping. For orders below ₹500, a flat shipping fee of ₹50 is applied. Express shipping charges vary by location." },
          { title: "Order Processing", text: "Orders are processed within 24-48 hours of placement. Orders placed on weekends or holidays are processed on the next business day." },
          { title: "Order Tracking", text: "Once your order is shipped, you will receive an SMS and email with a tracking link. You can also track your order in the 'My Orders' section of your account." },
          { title: "Delivery Attempts", text: "Our delivery partner will make up to 3 delivery attempts. If delivery is not successful after 3 attempts, the order will be returned to us and a refund will be initiated." },
          { title: "Damaged in Transit", text: "If your product arrives damaged, please refuse the delivery and contact us within 48 hours with photos. We will send a replacement at no extra cost." },
        ].map((item) => (
          <div key={item.title} className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600">Shipping queries? Call us at <strong className="text-gray-900">8859000084</strong> or WhatsApp us</p>
        </div>
      </div></div>
      <Footer />
    </>
  );
}
export default ShippingPolicy;
