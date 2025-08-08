import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("mesthri_basic");
    navigate("/customer");
  }

  const link =
    "text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/10 transition";

  return (
    <nav className="bg-rainbow shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white font-extrabold text-xl tracking-wide">
          Mesthri
        </Link>
        <div className="flex gap-1">
          <Link to="/search" className={link}>Directory</Link>
          <Link to="/customer" className={link}>Customer</Link>
          <Link to="/mestri" className={link}>Mestri</Link>
          <Link to="/worker" className={link}>Worker</Link>
        </div>
        <button
          onClick={logout}
          className="bg-white text-indigo-700 font-bold px-3 py-2 rounded-md hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
