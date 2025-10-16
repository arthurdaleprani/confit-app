// src/pages/index.tsx
import React from "react";
import Link from "next/link";
import { User } from "lucide-react"; 

export default function Home() {
  const buttonColor = "bg-purple-300"; 
  const buttonHoverColor = "hover:bg-purple-400";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          
          <div className="flex space-x-8 text-sm font-light"> 
            <Link href="/orders/history" className="text-gray-700 hover:text-purple-600 transition">Histórico de pedidos</Link>
            <Link href="/orders/pending-payment" className="text-gray-700 hover:text-purple-600 transition">Pedidos à pagar</Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">Fale Conosco</Link>
          </div>

             <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
            <span className="font-bold text-gray-900">ConfIT</span>
          </div>

          <div className="flex items-center space-x-8 text-sm font-light">
            <span className="text-gray-700">Vitória - ES</span>
            
            <Link 
              href="/order/create" 
              className="text-gray-700 hover:text-purple-600 transition"
            >
              Fazer pedido
            </Link>

            <div className="flex items-center space-x-1 text-gray-700">
                <User className="h-5 w-5 text-purple-600 opacity-70" />
                <span className="font-light">User</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        
        <h1 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4 tracking-tight">
          Encomende o seu bolo perfeito!
        </h1>

        <p className="text-base text-gray-600 mb-12 max-w-xl font-light">
          Selecione a massa, recheio e decoração do bolo dos seus sonhos e deixe a gente encarregado de encontrar a confeitaria perfeita pra você!
        </p>
        
        <div className="mb-10 w-full max-w-[200px]"> {/* Largura fixa para centralizar o input de forma compacta */}
          <label htmlFor="event-date" className="text-gray-600 mb-3 block text-sm font-light">Data do seu evento:</label>
          
          <div className="relative">
             <input 
                id="event-date"
                type="date" 
                // Estilos para o input: remove a borda, adiciona borda inferior
                // e centraliza o texto.
                className="w-full text-center border-0 border-b-2 border-gray-300 focus:border-purple-500 focus:ring-0 p-2 text-xl text-gray-800 font-light bg-transparent appearance-none transition duration-150 cursor-pointer"
                // Valor de exemplo (pode ser ajustado com useState no React)
                defaultValue="2021-06-22" 
                // A classe 'appearance-none' é crucial para estilizar o input[type="date"]
             />
          </div>
        </div>
        
        <Link 
          href="/order/create"
          className={`px-16 py-4 ${buttonColor} text-white font-normal rounded-lg shadow-md ${buttonHoverColor} transition duration-200 transform`}
        >
          Fazer o meu Pedido
        </Link>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 py-8">
        <div className="max-w-7xl mx-auto flex justify-around text-sm px-8 font-light">
          
          <div className="w-1/4">
            <h3 className="font-normal mb-3">Institucional</h3>
            <Link href="/about" className="block hover:text-purple-600 transition">Sobre a CakeBake</Link>
          </div>
          
          <div className="w-1/4">
            <h3 className="font-normal mb-3">Políticas Institucionais</h3>
            <Link href="/privacy" className="block hover:text-purple-600 transition">Política de Privacidade</Link>
          </div>
          
          <div className="w-1/4">
            <h3 className="font-normal mb-3">Ajuda</h3>
            <Link href="/faq" className="block hover:text-purple-600 transition">Dúvidas Frequentes</Link>
          </div>
          
          <div className="w-1/4">
            <h3 className="font-normal mb-3">Entre em contato</h3>
            <p>contato@confit.com</p>
          </div>

        </div>
      </footer>
    </div>
  );
}