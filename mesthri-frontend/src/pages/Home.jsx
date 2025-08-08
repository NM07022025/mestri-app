import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold drop-shadow mb-4">
          Welcome to Mesthri
        </h1>
        <p className="text-white/90 mb-10 text-lg">
          Connect customers with Mestris and Workers. Log in or register to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/customer"
            className="bg-white/90 hover:bg-white text-indigo-700 font-bold py-4 rounded-xl shadow transition"
          >
            Customer
          </Link>
          <Link
            to="/mestri"
            className="bg-white/90 hover:bg-white text-indigo-700 font-bold py-4 rounded-xl shadow transition"
          >
            Mestri
          </Link>
          <Link
            to="/worker"
            className="bg-white/90 hover:bg-white text-indigo-700 font-bold py-4 rounded-xl shadow transition"
          >
            Worker
          </Link>
          <Link
            to="/search"
            className="bg-white/90 hover:bg-white text-indigo-700 font-bold py-4 rounded-xl shadow transition"
          >
            Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
