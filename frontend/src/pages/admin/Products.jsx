import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API from '../../api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: 'Unisex',
        type: 'New Release'
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const res = await API.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
        payload.append('image', image);

        try {
            await API.post('/products', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await Swal.fire({ icon: 'success', title: 'Produk berhasil ditambahkan', timer: 1200, showConfirmButton: false });
            setFormData({ name: '', price: '', description: '', stock: '', category: 'Unisex', type: 'New Release' });
            setImage(null);
            getProducts();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal tambah produk', text: err.response?.data?.message || 'Internal Error' });
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Hapus produk ini?',
            showCancelButton: true
        });
        if (!result.isConfirmed) return;

        try {
            await API.delete(`/products/${id}`);
            getProducts();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Gagal hapus produk' });
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Tambah Produk</h1>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 max-w-4xl">
                <input className="border rounded-lg p-3" placeholder="Nama Produk" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input className="border rounded-lg p-3" placeholder="Harga" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                <input className="border rounded-lg p-3" placeholder="Stok" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                <select className="border rounded-lg p-3" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option>Men</option><option>Women</option><option>Unisex</option>
                </select>
                <select className="border rounded-lg p-3" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option>Collab</option><option>New Release</option><option>Best Seller</option>
                </select>
                <input className="border rounded-lg p-3" type="file" onChange={(e) => setImage(e.target.files[0])} required />
                <textarea className="border rounded-lg p-3 md:col-span-2" rows="4" placeholder="Deskripsi" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                <button disabled={loading} className="bg-gray-900 text-white rounded-lg p-3 md:col-span-2">
                    {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
            </form>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Nama</th>
                            <th className="p-3 text-left">Kategori</th>
                            <th className="p-3 text-left">Tipe</th>
                            <th className="p-3 text-left">Harga</th>
                            <th className="p-3 text-left">Stok</th>
                            <th className="p-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">{p.name}</td>
                                <td className="p-3">{p.category}</td>
                                <td className="p-3">{p.type}</td>
                                <td className="p-3">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                                <td className="p-3">{p.stock}</td>
                                <td className="p-3">
                                    <button onClick={() => deleteProduct(p.id)} className="text-red-600">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;