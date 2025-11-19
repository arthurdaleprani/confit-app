// app/bolo/page.tsx ou pages/bolo.tsx
"use client";
import Link from "next/link";
import { User } from "lucide-react"; 
import { useState } from "react";
import Header from "../../components/headerConfeiteira";


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
         <Header />


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
