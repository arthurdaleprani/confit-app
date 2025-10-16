// app/bolo/page.tsx ou pages/bolo.tsx
"use client";
import Link from "next/link";
import { User } from "lucide-react"; 
import { useState } from "react";

type Etapa = "Massa" | "Recheio" | "Decoração";

const opcoes = {
  Massa: ["Chocolate", "Baunilha", "Red Velvet"],
  Recheio: ["Brigadeiro", "Paçoca", "Doce de Leite", "Ninho"],
  Decoração: ["Frutas", "Granulado", "Chantilly"],
};

export default function MontarBolo() {
  const [etapa, setEtapa] = useState<Etapa>("Massa");
  const [selecionados, setSelecionados] = useState<Record<Etapa, string[]>>({
    Massa: [],
    Recheio: [],
    Decoração: [],
  });

  const toggleSelecionado = (item: string) => {
    setSelecionados({
      ...selecionados,
      [etapa]: selecionados[etapa].includes(item)
        ? selecionados[etapa].filter((i) => i !== item)
        : [...selecionados[etapa], item],
    });
  };

  const irProximaEtapa = () => {
    if (etapa === "Massa") setEtapa("Recheio");
    else if (etapa === "Recheio") setEtapa("Decoração");
  };

  const irEtapaAnterior = () => {
    if (etapa === "Decoração") setEtapa("Recheio");
    else if (etapa === "Recheio") setEtapa("Massa");
  };

  return (
   <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          
          <div className="flex space-x-8 text-sm font-light"> 
            <Link href="/orders/history" className="text-gray-700 hover:text-purple-600 transition">Histórico de pedidos</Link>
            <Link href="/orders/pending-payment" className="text-gray-700 hover:text-purple-600 transition">Pedidos à pagar</Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">Fale Conosco</Link>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-purple-300 opacity-80"></div>
            <Link href="/" className="font-normal text-xl text-gray-900 tracking-tight">ConfIT</Link>
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

      <div>O nosso servico consiste na seleçao
        de todos os elementos para a
        montagem do seu Bolo Perfeito</div>     
         <div className="flex space-x-8">
        <div className="w-1/4 space-y-4">
          <button
            className={`w-full py-2 rounded-full ${
              etapa === "Massa" ? "bg-purple-300 text-white" : "bg-purple-100 text-purple-800"
            }`}
            onClick={() => setEtapa("Massa")}
          >
            Massa
          </button>
          <button
            className={`w-full py-2 rounded-full ${
              etapa === "Recheio" ? "bg-purple-300 text-white" : "bg-purple-100 text-purple-800"
            }`}
            onClick={() => setEtapa("Recheio")}
          >
            Recheio
          </button>
          <button
            className={`w-full py-2 rounded-full ${
              etapa === "Decoração" ? "bg-purple-300 text-white" : "bg-purple-100 text-purple-800"
            }`}
            onClick={() => setEtapa("Decoração")}
          >
            Decoração
          </button>
        </div>

        <div className="flex-1 bg-white p-8 rounded-lg shadow">
          <button onClick={irEtapaAnterior} className="text-gray-500 mb-4">
            &lt; Voltar
          </button>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 ">
            Selecione os {etapa.toLowerCase()}s que você trabalha
          </h1>
          <p className="text-gray-900 mb-4">
            Escolha os itens desejados para o seu bolo
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {opcoes[etapa].map((item) => (
              <label key={item} className="flex items-center space-x-2 text-gray-900">
                <input
                  type="checkbox"
                  checked={selecionados[etapa].includes(item)}
                  onChange={() => toggleSelecionado(item)}
                  className="w-4 h-4 accent-purple-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <button
            onClick={irProximaEtapa}
            className="mt-6 w-full py-2 bg-purple-200 rounded-full text-white hover:bg-purple-300 disabled:opacity-50"
            disabled={etapa === "Decoração"}
          >
            Próximo &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
