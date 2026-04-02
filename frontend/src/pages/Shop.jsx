import { useEffect, useState } from "react";

export default function Shop() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-800 flex justify-between">
        <h1 className="text-2xl font-bold text-cyan-400">
          Parfum Store
        </h1>

        <button className="bg-cyan-500 px-4 py-2 rounded-lg">
          Cart 🛒
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >

            {/* IMAGE */}
            {item.image && (
              <img
                src={`http://localhost:3000/uploads/${item.image}`}
                className="w-full h-40 object-cover"
              />
            )}

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-2">

              <h2 className="font-semibold">{item.name}</h2>

              <p className="text-cyan-400 font-bold">
                Rp {item.price}
              </p>

              <p className="text-sm text-gray-400">
                Stock: {item.stock}
              </p>

              <button className="mt-2 bg-cyan-500 hover:bg-cyan-600 px-3 py-2 rounded-lg">
                Add to Cart
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}