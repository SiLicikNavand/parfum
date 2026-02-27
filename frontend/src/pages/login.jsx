export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl w-[360px] text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/20 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/20 outline-none"
        />

        <button className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:scale-105 transition">
          Masuk
        </button>
      </div>
    </div>
  )
}