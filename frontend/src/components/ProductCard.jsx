import { useNavigate } from "react-router-dom";

function ProductCard({ id, name, price, image }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer"
    >
      <img
        src={image}
        alt={name}
        onError={(e) =>
          (e.currentTarget.src =
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18">Image Not Available</text></svg>')
        }
        className="w-full h-64 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>

        <p className="text-yellow-600 font-bold mt-2">
          ₹{price}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${id}`);
          }}
          className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          View Details
        </button>
      </div>

    </div>
  );
}

export default ProductCard;
