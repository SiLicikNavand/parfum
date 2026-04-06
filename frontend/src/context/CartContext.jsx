import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // LOAD: Ambil data saat aplikasi pertama kali jalan
    useEffect(() => {
        const savedCart = localStorage.getItem('parfum_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                setCart([]);
            }
        }
    }, []);

    // SAVE: Simpan setiap kali ada perubahan di array cart
    useEffect(() => {
        localStorage.setItem('parfum_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find((item) => item.id === product.id);
            if (existingItem) {
                // Jika sudah ada, tambah quantity
                return currentCart.map((item) =>
                    item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
                );
            }
            // Jika baru, masukkan ke array
            return [...currentCart, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((currentCart) => currentCart.filter((item) => item.id !== id));
    };

    const updateQty = (id, amount) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, (item.qty || 1) + amount);
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};