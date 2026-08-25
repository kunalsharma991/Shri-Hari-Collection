import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const products = [
  {
    id: 1,
    name: "Men's Shirt",
    price: 999,
    image: "/images/products/shirt.jpg"
  },
  {
    id: 2,
    name: "Women's Kurti",
    price: 1299,
    image: "/images/products/womens-kurti.jpg"
  },
  {
    id: 3,
    name: "Kids Dress",
    price: 799,
    image: "/images/products/kids-dress.jpg",
  },
  {
    id: 4,
    name: "Casual Shoes",
    price: 1999,
    image: "/images/products/shoes.jpg",
  },
];

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
