import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BASE_URL from "../api"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, { // 🔥 FIX DI SINI
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        localStorage.setItem("token", data.token)
        alert("Login berhasil 🔥")
        navigate("/admin")
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-10 rounded-xl w-[300px]">
        <h2 className="text-xl mb-4 text-center font-bold">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-3"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full p-2 rounded"
        >
          Masuk
        </button>
      </div>
    </div>
  )
}