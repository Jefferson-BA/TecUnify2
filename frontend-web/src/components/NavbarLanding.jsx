import { Link } from "react-router-dom";

export default function NavbarLanding() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    <img src="/logo1.png" className="w-16 mx-auto mb-1 " />

      </h1>

      <Link
        to="/login"
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Iniciar Sesión
      </Link>
    </nav>
  );
}
