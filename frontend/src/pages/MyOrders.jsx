import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import orders from "../data/orders";
import { FaBox, FaCalendarAlt, FaMoneyBillWave, FaChevronRight } from "react-icons/fa";

function MyOrders() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="My Orders"
        subtitle="Track and manage your orders"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Orders" }]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {orders.length === 0 ? (
            <EmptyState
              icon={FaBox}
              title="No Orders Yet"
              description="You haven't placed any orders. Start shopping to see your orders here!"
              actionLabel="Shop Now"
              actionLink="/products"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FaBox className="text-yellow-500 text-xs" />
                        <span className="font-semibold text-gray-900">#{order.id}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400 text-xs" />
                        {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaMoneyBillWave className="text-gray-400 text-xs" />
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 flex-shrink-0 bg-gray-50 rounded-xl p-3 min-w-[200px]">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"} • {order.items.length} item{order.items.length > 1 && "s"}
                      </p>
                      <Link
                        to={`/order-success`}
                        className="flex items-center gap-1 text-sm text-yellow-600 font-semibold hover:text-yellow-700 transition"
                      >
                        View Details <FaChevronRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyOrders;
