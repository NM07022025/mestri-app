import { useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8082";

export default function Worker() {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");

  async function register(e) {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        phone, password, name, role: "WORKER", location,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Registration failed");
      setMessage("Registration successful! Please login.");
      setTab("login");
    } catch (err) { setMessage(err.message); }
  }

  async function login(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || text || "Login failed");
      localStorage.setItem("mesthri_basic", "Basic " + btoa(`${phone}:${password}`));
      setMessage("Login successful!");
    } catch (err) { setMessage(err.message); }
  }

  return (
    <div className="min-h-screen bg-rainbow">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-600">Worker</h1>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab("login")}
              className={`flex-1 py-2 rounded-lg font-semibold ${tab === "login" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              Login
            </button>
            <button onClick={() => setTab("register")}
              className={`flex-1 py-2 rounded-lg font-semibold ${tab === "register" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              Register
            </button>
          </div>

          {tab === "register" ? (
            <form onSubmit={register} className="space-y-4">
              <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">Create Account</button>
            </form>
          ) : (
            <form onSubmit={login} className="space-y-4">
              <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">Sign In</button>
            </form>
          )}

          {message && (
            <div className={`mt-4 text-center ${message.toLowerCase().includes("successful") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
