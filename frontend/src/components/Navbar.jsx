import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [show, setShow] = useState(false)

  return (
    <>
      {/* Trigger area */}
      <div
        className="fixed top-0 left-0 w-full h-3 z-40"
        onMouseEnter={() => setShow(true)}
      />

      <nav
        onMouseLeave={() => setShow(false)}
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-300
          ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
          bg-black/60 backdrop-blur-xl
        `}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">
            PARFUM SHOP
          </h1>

          <div className="flex gap-6 text-white text-sm">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </nav>
    </>
  )
}