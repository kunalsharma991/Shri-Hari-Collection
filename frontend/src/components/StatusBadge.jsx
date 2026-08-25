// Order status badge component
function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "Pending",
      classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    processing: {
      label: "Processing",
      classes: "bg-blue-100 text-blue-700 border-blue-200",
    },
    shipped: {
      label: "Shipped",
      classes: "bg-purple-100 text-purple-700 border-purple-200",
    },
    delivered: {
      label: "Delivered",
      classes: "bg-green-100 text-green-700 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const { label, classes } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {label}
    </span>
  );
}

export default StatusBadge;
