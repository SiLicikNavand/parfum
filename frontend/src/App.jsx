import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'

const PRODUCTS = [
  {
    id: 1,
    name: 'Coffee Latte',
    price: 25000,
    desc: 'Kopi susu creamy dengan rasa balance antara pahit dan manis.',
    image: 'https://source.unsplash.com/400x400/?coffee'
  },
  {
    id: 2,
    name: 'Matcha Latte',
    price: 30000,
    desc: 'Minuman matcha segar dengan susu lembut.',
    image: 'https://source.unsplash.com/400x400/?matcha'
  },
  {
    id: 3,
    name: 'Chocolate Ice',
    price: 28000,
    desc: 'Minuman coklat dingin yang rich dan manis.',
    image: 'https://source.unsplash.com/400x400/?chocolate'
  }
]

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  return (
    <>
      <Navbar cart={cart} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Detail addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </>
  )
}

function Navbar({ cart }) {
  return (
    <div style={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/cart">
        🛒 Cart ({cart.reduce((a, b) => a + b.qty, 0)})
      </Link>
    </div>
  )
}

function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h2>Menu Produk</h2>

      <div style={styles.grid}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={styles.card} onClick={() => navigate(`/product/${p.id}`)}>
            <img src={p.image} style={styles.image} />
            <h3>{p.name}</h3>
            <p>Rp {p.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Detail({ addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const product = PRODUCTS.find(p => p.id === parseInt(id))
  const [qty, setQty] = useState(1)

  if (!product) return <p>Produk tidak ditemukan</p>

  return (
    <div style={styles.detailContainer}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <img src={product.image} style={styles.detailImage} />

      <h2>{product.name}</h2>
      <h3>Rp {product.price.toLocaleString()}</h3>

      <p>{product.desc}</p>

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
        <span style={{ margin: '0 15px' }}>{qty}</span>
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>

      <button
        style={styles.button}
        onClick={() => {
          addToCart(product, qty)
          navigate('/cart')
        }}
      >
        Add to Cart
      </button>
    </div>
  )
}

function Cart({ cart }) {
  return (
    <div style={styles.container}>
      <h2>Keranjang</h2>

      {cart.length === 0 && <p>Keranjang kosong</p>}

      {cart.map(item => (
        <div key={item.id} style={styles.card}>
          <h3>{item.name}</h3>
          <p>Qty: {item.qty}</p>
          <p>Total: Rp {(item.price * item.qty).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    borderBottom: '1px solid #ddd'
  },
  container: {
    padding: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px'
  },
  card: {
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    borderRadius: '10px'
  },
  detailContainer: {
    padding: '20px'
  },
  detailImage: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '10px'
  },
  button: {
    padding: '10px 15px',
    background: 'black',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}