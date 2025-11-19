// src/pages/index.tsx
import React from "react";
import Link from "next/link";
import { User } from "lucide-react"; 
import ROUTES from "../../routes"; 
import Header from "../../components/header";

export default function Home() {
  const buttonColor = "bg-purple-300"; 
  const buttonHoverColor = "hover:bg-purple-400";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
                    <Header />

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
          href={ROUTES.FAZER_PEDIDO}
          className={`px-16 py-4 ${buttonColor} text-white font-normal rounded-lg shadow-md ${buttonHoverColor} transition duration-200 transform`}
        >
          Fazer o meu Pedido
        </Link>
      </main>


    </div>
  );
}