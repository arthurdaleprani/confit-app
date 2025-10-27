// app/bolo/page.tsx ou pages/bolo.tsx
"use client";
import Link from "next/link";
import { User } from "lucide-react"; 
import { useState } from "react";


export default function Agenda() {
  

type Pedido = {
  id: number;
  data: string; 
  descricao: string;
};
const diasSemana = Array.from({ length: 5 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d.toISOString().split("T")[0]; 
});

const pedidos: Pedido[] = [
  { id: 23456, data: diasSemana[1], descricao: "Pedido: #23456" },
  { id: 1235, data: diasSemana[1], descricao: "Pedido: #1235" },
  { id: 23456, data: diasSemana[2], descricao: "Pedido: #23456" },
];

  return (
   <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          
          <div className="flex space-x-8 text-sm font-light"> 
            <Link href="/orders/history" className="text-gray-700 hover:text-purple-600 transition">Histórico de pedidos</Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">Fale Conosco</Link>
          </div>

          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
            <span className="font-bold text-gray-900">ConfIT</span>
          </div>

          <div className="flex items-center space-x-8 text-sm font-light">
            <span className="text-gray-700">Vitória - ES</span>
            


            <div className="flex items-center space-x-1 text-gray-700">
                <User className="h-5 w-5 text-purple-600 opacity-70" />
                <span className="font-light">User</span>
            </div>
          </div>
        </nav>
      </header>

      <section>   <div className="p-6">
      <div className="grid grid-cols-5 gap-4 border-t border-gray-200">
        {diasSemana.map((dia) => (
          <div key={dia} className="border-l border-gray-200 min-h-[300px]">
            <div className="flex justify-center py-2">
              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {new Date(dia).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              

              </div>
            </div>

            <div className="space-y-2 px-3">
              {pedidos
                .filter((p) => p.data === dia)
                .map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-purple-200 text-white rounded-full py-2 px-4 text-center font-semibold"
                  >
                    {pedido.descricao}
                    <br></br>
                      <button className="px-4 py-2 bg-white text-purple-800 rounded-full">
Aprovar</button>
                    <br></br>
                                  <button className="px-4 py-2 bg-white text-purple-800 rounded-full">
Reprovar</button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div></section>
</div>

  );
}
