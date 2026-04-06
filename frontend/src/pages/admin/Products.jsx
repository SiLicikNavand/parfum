import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('Unisex');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Gagal load data", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Preview gambar sebelum upload
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/products', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            });
            alert("✅ Produk Berhasil Disimpan!");
            window.location.reload(); 
        } catch (err) {
            alert("❌ Gagal: " + (err.response?.data?.message || "Terjadi kesalahan"));
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Yakin ingin menghapus produk ini?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                getProducts();
            } catch (err) {
                alert("Gagal hapus");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-8 border-l-8 border-indigo-600 pl-4 uppercase">
                    Manajemen Produk Parfum
                </h1>

                {/* FORM TAMBAH PRODUK */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                        Tambah Koleksi Baru
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input type="text" placeholder="Nama Parfum" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" onChange={(e) => setName(e.target.value)} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Harga (Rp)" className="p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" onChange={(e) => setPrice(e.target.value)} required />
                                <input type="number" placeholder="Stok" className="p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" onChange={(e) => setStock(e.target.value)} required />
                            </div>
                            <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500" onChange={(e) => setCategory(e.target.value)}>
                                <option value="Unisex">Unisex</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                            </select>
                            <textarea placeholder="Deskripsi Wangi Parfum..." className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 h-32" onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-6 hover:border-indigo-400 transition-colors">
                            {preview ? (
                                <img src={preview} className="w-full h-64 object-cover rounded-2xl shadow-lg mb-4" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="text-5xl mb-2">📸</p>
                                    <p>Upload Foto Parfum</p>
                                </div>
                            )}
                            <input type="file" className="mt-4 text-sm" onChange={handleFileChange} required />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="md:col-span-2 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-lg active:scale-95 disabled:bg-gray-400"
                        >
                            {loading ? "MENYIMPAN..." : "KONFIRMASI & SIMPAN PRODUK"}
                        </button>
                    </form>
                </div>

                {/* TABEL DAFTAR PRODUK */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-5 text-left">PRODUK</th>
                                <th className="p-5 text-left">INFO</th>
                                <th className="p-5 text-left">HARGA</th>
                                <th className="p-5 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-5 flex items-center gap-4">
                                        <img 
                                            src={`http://localhost:5000/uploads/${p.image}`} 
                                            className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100" 
                                            onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                                        />
                                        <div>
                                            <p className="font-black text-gray-800 uppercase">{p.name}</p>
                                            <p className="text-xs text-gray-400 font-bold tracking-widest">{p.category}</p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-sm text-gray-500">Stok: <span className="font-bold text-gray-800">{p.stock} pcs</span></p>
                                    </td>
                                    <td className="p-5">
                                        <p className="font-black text-indigo-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white transition">HAPUS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;