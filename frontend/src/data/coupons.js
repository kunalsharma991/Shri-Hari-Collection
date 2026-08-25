// Mock coupon data for admin management
const coupons = [
  {
    id: 1,
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    expiryDate: "2026-12-31",
    isActive: true,
    usageCount: 145,
    maxUsage: 500,
  },
  {
    id: 2,
    code: "SUMMER20",
    discount: 20,
    type: "percentage",
    expiryDate: "2026-08-31",
    isActive: true,
    usageCount: 67,
    maxUsage: 200,
  },
  {
    id: 3,
    code: "FLAT500",
    discount: 500,
    type: "flat",
    expiryDate: "2026-07-15",
    isActive: true,
    usageCount: 32,
    maxUsage: 100,
  },
  {
    id: 4,
    code: "FESTIVE25",
    discount: 25,
    type: "percentage",
    expiryDate: "2026-03-31",
    isActive: false,
    usageCount: 200,
    maxUsage: 200,
  },
];

export default coupons;
