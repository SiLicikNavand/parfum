import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import CartProvider dari context yang kita buat tadi
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BUNGKUS APLIKASI DENGAN PROVIDER */}
    {/* Ini kunci agar error "Cannot destructure property 'cart'" hilang selamanya */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);