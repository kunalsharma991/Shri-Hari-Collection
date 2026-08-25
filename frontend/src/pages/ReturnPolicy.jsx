import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { FaUndo } from "react-icons/fa";

function ReturnPolicy() {
  return (
    <>
      <Navbar />
      <PageHeader title="Return & Refund Policy" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Return & Refund Policy" }]} />
      <div className="bg-white py-16"><div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <FaUndo className="text-yellow-500 text-xl" />
          <p className="text-sm text-gray-700 !mt-0">7-Day Easy Returns on all products</p>
        </div>
        {[
          { title: "Return Eligibility", text: "Products can be returned within 7 days of delivery. Items must be unused, unwashed, and in their original condition with all tags attached. Sale items and innerwear are not eligible for return." },
          { title: "How to Initiate a Return", text: "Log in to your account, go to 'My Orders', select the order you wish to return, and click the 'Return' button. Our logistics partner will arrange a pickup within 2-3 business days." },
          { title: "Exchange Policy", text: "We offer free exchanges for size or color changes within 7 days of delivery. The exchanged product will be shipped after we receive and verify the original product." },
          { title: "Refund Process", text: "Once we receive and inspect the returned product, your refund will be initiated. For online payments, refunds are credited within 5-7 business days. For COD orders, refunds are processed via bank transfer within 7-10 business days." },
          { title: "Non-Returnable Items", text: "The following items cannot be returned or exchanged: innerwear, accessories on sale, products damaged due to customer misuse, and products without original tags." },
          { title: "Damaged or Wrong Product", text: "If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photos. We will arrange an immediate replacement or full refund." },
        ].map((item) => (
          <div key={item.title} className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600">Need help with a return? Call us at <strong className="text-gray-900">8859000084</strong></p>
        </div>
      </div></div>
      <Footer />
    </>
  );
}
export default ReturnPolicy;
