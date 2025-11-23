"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "../routes";

type UserStorage = {
  id: number;
  nomeCompleto: string;
};

export default function Header() {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const userStorage = localStorage.getItem("usuario");
    if (userStorage) {
      const user: UserStorage = JSON.parse(userStorage);
      setUserName(user.nomeCompleto);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token"); // se estiver armazenando o token
    router.push(ROUTES.HOME); // redireciona para página de login
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* LEFT */}
        <div className="flex space-x-8 text-sm font-light">
          <Link href={ROUTES.AGN_PED_CONF} className="text-gray-700 hover:text-purple-600 transition">
            Histórico de pedidos
          </Link>
          <Link href={ROUTES.AGN_APROV} className="text-gray-700 hover:text-purple-600 transition">
            Pedidos à aprovar
          </Link>
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
          <div className="flex items-center space-x-1 text-gray-700">
            <User className="h-5 w-5 text-purple-600 opacity-70" />
            <span className="font-light">{userName}</span>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition font-light"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>

      </nav>
    </header>
  );
}
