"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import ROUTES from "@/app/routes";
import Header from "../../components/headerConfeiteira";

type Etapa = "Massa" | "Recheio" | "Decoração";

const opcoes: Record<Etapa, string[]> = {
  Massa: ["Chocolate", "Baunilha", "Red Velvet"],
  Recheio: [
    "Brigadeiro",
    "Paçoca",
    "Pistache",
    "Doce de Leite",
    "Avelã Crocante",
    "Caramelo Salgado",
    "Ninho",
  ],
  Decoração: ["Frutas", "Granulado", "Chantilly"],
};

const NEXT_PAGE_URL = ROUTES.AGN_PED_CONF;
const MAX_RECHEIOS = 3;

export default function MontarBolo() {
  const steps: Etapa[] = ["Massa", "Recheio", "Decoração"];

  const [etapa, setEtapa] = useState<Etapa>("Recheio");
  const [selecionados, setSelecionados] = useState<Record<Etapa, string[]>>({
    Massa: [],
    Recheio: ["Brigadeiro", "Paçoca"],
    Decoração: [],
  });

  const currentStepIndex = steps.indexOf(etapa);
  const isFinalStep = currentStepIndex === steps.length - 1;

  const toggleSelecionado = (item: string) => {
    setSelecionados((prev) => {
      const atual = prev[etapa];

      if (atual.includes(item)) {
        return { ...prev, [etapa]: atual.filter((i) => i !== item) };
      }

      if (etapa === "Recheio" && atual.length >= MAX_RECHEIOS) return prev;
      if (etapa === "Massa") return { ...prev, [etapa]: [item] };

      return { ...prev, [etapa]: [...atual, item] };
    });
  };

  const isNextDisabled =
    (etapa === "Massa" && selecionados.Massa.length === 0) ||
    (etapa === "Recheio" && selecionados.Recheio.length === 0);

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER FIXO */}
      <Header />

      <div className="pt-24 max-w-7xl mx-auto flex w-full px-6 pb-12">

        {/* SIDEBAR */}
        <aside className="w-1/4 pr-8 border-r border-gray-200">

          {/* Botão Voltar */}
          <button
            onClick={() => currentStepIndex > 0 && setEtapa(steps[currentStepIndex - 1])}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-10 transition"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
          </button>

          {/* Texto explicativo */}
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">
            Para aparecer para mais clientes, marque todos os itens que você
            trabalha! Assim seu <span className="text-purple-600 font-semibold">Bolo Perfeito</span> ganha destaque.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const active = step === etapa;
              const completed = index < currentStepIndex;

              return (
                <button
                  key={step}
                  disabled={!active && !completed}
                  onClick={() => (active || completed) && setEtapa(step)}
                  className={`w-full py-3 rounded-lg text-lg transition
                    ${active ? "bg-purple-500 text-white font-semibold shadow"
                      : completed ? "bg-purple-200 text-purple-900"
                      : "bg-gray-100 text-gray-600"}
                    ${!active && !completed ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
                  `}
                >
                  {step}
                </button>
              );
            })}
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 pl-10">

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Selecione os {etapa.toLowerCase()}s
          </h1>

          <p className="text-gray-500 mb-8">
            {etapa === "Recheio"
              ? `Escolha até ${MAX_RECHEIOS} recheios`
              : "Escolha os itens desejados"}
          </p>

          {/* LISTA DE OPÇÕES */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {opcoes[etapa].map((item) => {
              const selected = selecionados[etapa].includes(item);
              const disabled =
                etapa === "Recheio" &&
                !selected &&
                selecionados.Recheio.length >= MAX_RECHEIOS;

              return (
                <label
                  key={item}
                  className={`flex items-center space-x-4 text-xl py-2 cursor-pointer transition
                    ${disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => toggleSelecionado(item)}
                    className="w-5 h-5 rounded border-gray-400 text-purple-600 focus:ring-purple-300"
                  />
                  <span className={disabled ? "text-gray-400" : "text-gray-800"}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>

          {/* BOTÃO FINAL */}
          <div className="flex justify-end mt-10">
            {isFinalStep ? (
              <Link
                href={NEXT_PAGE_URL}
                className="w-full max-w-sm flex items-center justify-center 
                  px-6 py-3 rounded-full bg-purple-600 text-white text-lg 
                  hover:bg-purple-700 transition"
              >
                Concluir e Avançar <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <button
                disabled={isNextDisabled}
                onClick={() => setEtapa(steps[currentStepIndex + 1])}
                className={`w-full max-w-sm flex items-center justify-center px-6 py-3 rounded-full text-lg transition
                  ${isNextDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-500 text-white hover:bg-purple-600"}
                `}
              >
                Avançar <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>

        </main>

      </div>
    </div>
  );
}
