import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // SUBMIT (CREATE / UPDATE + IMAGE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    if (form.image) {
      formData.append("image", form.image);
    }

    if (editId) {
      await fetch(`http://localhost:3000/products/${editId}`, {
        method: "PUT",
        body: formData
      });
    } else {
      await fetch("http://localhost:3000/products", {
        method: "POST",
        body: formData
      });
    }

    setShowForm(false);
    setEditId(null);
    setForm({ name: "", price: "", stock: "", image: null });
    fetchProducts();
  };

  // DELETE
  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:3000/products/${deleteId}`, {
      method: "DELETE"
    });

    setShowDelete(false);
    setDeleteId(null);
    fetchProducts();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      stock: item.stock,
      image: null
    });
    setEditId(item.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          Parfum Admin
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Produk</h2>

          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ name: "", price: "", stock: "", image: null });
            }}
            className="px-4 py-2 bg-cyan-500 rounded-lg"
          >
            + Tambah Produk
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-black/70 fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl w-80">
              <h2 className="mb-4">
                {editId ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                <input
                  type="text"
                  name="name"
                  placeholder="Nama"
                  value={form.name}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded"
                  required
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Harga"
                  value={form.price}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded"
                  required
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stok"
                  value={form.stock}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded"
                  required
                />

                {/* 🔥 INPUT GAMBAR */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                  className="p-2 bg-gray-800 rounded"
                />

                <div className="flex gap-2 mt-2">
                  <button className="bg-cyan-500 px-3 py-2 rounded">
                    Simpan
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 px-3 py-2 rounded"
                  >
                    Batal
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDelete && (
          <div className="bg-black/70 fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl text-center">
              <h2 className="text-red-400 mb-4">
                Yakin ingin menghapus?
              </h2>

              <div className="flex justify-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Hapus
                </button>

                <button
                  onClick={() => setShowDelete(false)}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto bg-gray-900 rounded-xl">
          <table className="w-full table-fixed text-center">

            <thead className="bg-gray-800 text-cyan-400">
              <tr>
                <th className="p-4">Gambar</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-t border-gray-700">

                  {/* 🔥 GAMBAR */}
                  <td className="p-4">
                    {item.image && (
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                      />
                    )}
                  </td>

                  <td className="p-4">{item.name}</td>
                  <td className="p-4">Rp {item.price}</td>
                  <td className="p-4">{item.stock}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDelete(item.id)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}    