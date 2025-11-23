"use client";

import Link from "next/link";
import { User } from "lucide-react";
import ROUTES from "../routes";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        
        {/* LEFT */}
        <div className="flex space-x-8 text-sm font-light">
          <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">
            Fale Conosco
          </Link>
        </div>

        {/* LOGO */}
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
          <span className="font-bold text-gray-900">ConfIT</span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-6 text-sm font-light">

          <Link
            href="/login"
            className="text-gray-700 hover:text-purple-600 transition"
          >
            Login
          </Link>

          <Link
            href={ROUTES.CADASTRO}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-medium"
          >
            Cadastre-se
          </Link>

        </div>

      </nav>
    </header>
  );
}
