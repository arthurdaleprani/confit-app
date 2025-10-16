"use client";
import Link from "next/link";
import React from "react";
import ROUTES from "../routes";
import { useState } from "react";

export default function Register() {
  const [accountType, setAccountType] = useState<"cliente" | "confeitaria">("cliente");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
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
          <Link href={ROUTES.LOGIN}>
  <button className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full">
    Entrar
  </button>
</Link> 
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex">
        {/* Sidebar tipo de conta */}
        <aside className="w-1/4 bg-white p-6 flex flex-col items-start space-y-4 border-r border-gray-200">
          <h2 className="text-gray-500 mb-2">Selecione o tipo conta:</h2>
          <button
            onClick={() => setAccountType("cliente")}
            className={`w-full py-2 rounded-full text-white font-semibold ${
              accountType === "cliente" ? "bg-purple-400" : "bg-purple-200"
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setAccountType("confeitaria")}
            className={`w-full py-2 rounded-full text-white font-semibold ${
              accountType === "confeitaria" ? "bg-purple-400" : "bg-purple-200"
            }`}
          >
            Confeitaria
          </button>
        </aside>

        {/* Formulário */}
        <main className="flex-1 p-8  bg-white">
          <h1 className="text-3xl font-bold mb-4 text-gray-700 hover:text-gray-900">Bem-vinda(o)!</h1>
          <p className="text-gray-500 mb-6">
            Ficamos felizes com você entrando para a equipe de {accountType === "cliente" ? "clientes" : "confeitarias"} da Confeitaria Inteligente. Complete as informações abaixo:
          </p>

          <form className="flex flex-col space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Nome Completo"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              type="text"
              placeholder="CPF"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              type="text"
              placeholder="Telefone de contato"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              type="text"
              placeholder="CEP"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
        <input
              type="text"
              placeholder="Cidade"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
              <input
              type="text"
              placeholder="Estado"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
              <input
              type="text"
              placeholder="Rua"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
               <input
              type="text"
              placeholder="Bairro"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
               <input
              type="text"
              placeholder="Numero"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
                <input
              type="Password"
              placeholder="Senha"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />    <input
              type="Password"
              placeholder="Confirma Senha"
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <button
              type="submit"
              className="bg-purple-400 text-white rounded-full py-2 font-bold hover:bg-purple-500 transition"
            >
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
