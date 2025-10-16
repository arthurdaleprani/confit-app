import Link from "next/link";
import React from "react";
import ROUTES from "../routes"; // ajuste o caminho se necessário

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-gray-900">Sobre a ConfIT</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Experiências</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Fale Conosco</a>
        </div>
        <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
            <span className="font-bold text-gray-900">ConfIT</span>
          </div>
        <div className="flex items-center space-x-6">
          
          <a href="#" className="text-gray-700 hover:text-gray-900">Pedidos Online</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Confeitaria Online</a>
 <Link href={ROUTES.CADASTRO}>
  <button className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full">
    Cadastro
  </button>
</Link> 
        </div>
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 hover:text-gray-900">Bem-vinda(o)!</h1>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="E-mail"
  className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              type="password"
              placeholder="Senha"
  className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <button
              type="submit"
              className="bg-purple-200 text-black font-bold rounded-full py-2 hover:bg-purple-300 transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-400 mt-4 text-sm">
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
