import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/Login"
import Register from "./pages/Register"

function Home() {
  return (
    <MainLayout>
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-white text-5xl font-extrabold mb-4">
          Premium Parfum
        </h1>
        <p className="text-white/70 max-w-xl mb-8">
          Temukan aroma yang mencerminkan karakter dan kepercayaan dirimu.
        </p>
        <button className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition">
          Belanja Sekarang
        </button>
      </section>
    </MainLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}