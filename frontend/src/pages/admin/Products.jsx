import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PackagePlus, Image as ImageIcon, Tags, Database, Info } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Form Lengkap
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('Unisex');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // Jalankan ambil data saat halaman dibuka
    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Gagal load data produk, pastikan backend nyala!", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Membuat preview lokal
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // WAJIB PAKAI FormData untuk upload file
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
            
            // Reset Form tanpa reload agar smooth
            setName(''); 
            setPrice(''); 
            setStock(''); 
            setCategory('Unisex'); 
            setDescription('');
            setImage(null); 
            setPreview(null);
            
            getProducts(); // Update tabel otomatis
            
        } catch (err) {
            console.error("Error Post:", err.response?.data);
            alert("❌ Gagal Simpan: " + (err.response?.data?.message || "Internal Server Error"));
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Yakin ingin menghapus produk ini secara permanen?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert("🗑️ Produk Telah Dihapus!");
                getProducts();
            } catch (err) {
                alert("Gagal hapus produk");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 w-full">
            <div className="max-w-7xl mx-auto">
                {/* HEADER SECTION */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 border-l-8 border-indigo-600 pl-6 uppercase tracking-tighter italic">
                            Inventory <span className="text-indigo-600">Core</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.4em] mt-3 ml-8">Warehouse Management System v1.0</p>
                    </div>
                    <div className="bg-white px-8 py-4 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 flex items-center gap-4">
                        <Database className="text-indigo-600" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Database Status</p>
                            <p className="text-lg font-black text-gray-900 leading-none mt-1 uppercase italic">{products.length} Items</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    
                    {/* FORM SECTION (4 COLUMNS) */}
                    <div className="xl:col-span-4">
                        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-black mb-10 flex items-center gap-3 uppercase italic text-gray-800">
                                <span className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg rotate-3">
                                    <PackagePlus size={20} />
                                </span>
                                New Entry
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">
                                        <Info size={12} /> Product Name
                                    </label>
                                    <input type="text" placeholder="e.g. Sauvage Elixir" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Price (IDR)</label>
                                        <input type="number" placeholder="2400000" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all outline-none" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Stock</label>
                                        <input type="number" placeholder="12" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all outline-none" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">
                                        <Tags size={12} /> Category
                                    </label>
                                    <select className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold cursor-pointer transition-all outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="Unisex">🚻 Unisex</option>
                                        <option value="Men">🤵 Men</option>
                                        <option value="Women">💃 Women</option>
                                    </select>
                                </div>

                                {/* TAMBAHAN KOLOM DESKRIPSI YANG TADI HILANG */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">
                                        <Info size={12} /> Description Notes
                                    </label>
                                    <textarea 
                                        placeholder="Deskripsikan wangi parfum ini..." 
                                        className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all outline-none h-32 resize-none" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Visual Content</label>
                                    <div className="w-full h-48 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] p-4 hover:border-indigo-400 transition-all bg-gray-50/50 relative overflow-hidden group">
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover rounded-2xl shadow-xl" alt="Preview" />
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto text-gray-300 mb-2 group-hover:scale-110 transition-transform" size={32} />
                                                <p className="font-black text-gray-400 uppercase tracking-widest text-[9px]">Drop Image Here</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} required={!preview} />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition shadow-2xl active:scale-95 disabled:bg-gray-400 uppercase italic tracking-tighter"
                                >
                                    {loading ? "Syncing..." : "Submit to Inventory"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLE SECTION (8 COLUMNS) */}
                    <div className="xl:col-span-8">
                        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900 text-white">
                                    <tr>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Item Details</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Inventory</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em]">Valuation</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-center">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.length > 0 ? products.map((p) => (
                                        <tr key={p.id} className="hover:bg-indigo-50/30 transition-all group">
                                            <td className="p-8 flex items-center gap-6">
                                                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white group-hover:rotate-3 transition-transform duration-500">
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${p.image}`} 
                                                        className="w-full h-full object-cover" 
                                                        alt={p.name}
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Empty" }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 uppercase italic tracking-tighter text-xl leading-tight mb-2">{p.name}</p>
                                                    <span className="bg-white text-indigo-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm border border-indigo-50">{p.category}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Available</p>
                                                <p className="text-2xl font-black text-gray-800 tracking-tighter">{p.stock} <span className="text-[10px] text-gray-400 uppercase italic">Units</span></p>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">MSRP Price</p>
                                                <p className="text-2xl font-black text-indigo-600 tracking-tighter italic">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                                            </td>
                                            <td className="p-8 text-center">
                                                <button 
                                                    onClick={() => deleteProduct(p.id)} 
                                                    className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                                                    title="Delete Item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-20 text-center font-black text-gray-300 italic uppercase tracking-[0.5em] text-sm">
                                                No Archive Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;