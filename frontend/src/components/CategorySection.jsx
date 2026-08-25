function CategorySection() {
  const categories = [
    "Men",
    "Women",
    "Kids",
    "Footwear",
    "Accessories",
  ];

  return (
    <section className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">
        Shop By Category
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-black text-white p-8 rounded-xl text-center cursor-pointer hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold">{category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
