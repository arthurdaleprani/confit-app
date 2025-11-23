"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "../../components/header";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/app/routes";

type TipoIngredienteResponse = {
  id: number;
  nome: string;
  ingrediente: { id_Ingrediente: number; nome: string };
};

type ConfeiteiroResponse = {
  id: number;
  nomeCompleto: string;
};

export default function MontarBolo() {
  const MAX_RECHEIOS = 2;
const router = useRouter();

  const [tipos, setTipos] = useState<TipoIngredienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataEvento = localStorage.getItem("dataEvento");
  if (!dataEvento) {
    console.error("Nenhuma data salva!");
    return null;
  }
  const dataEventoISO = new Date(dataEvento).toISOString();

  const [etapa, setEtapa] = useState<string>("");
  const [selecionados, setSelecionados] = useState<Record<string, string[]>>({});
  const [mostrarConfeitarias, setMostrarConfeitarias] = useState(false);

  const [confeitarias, setConfeitarias] = useState<ConfeiteiroResponse[]>([]);
  const [loadingConfeitarias, setLoadingConfeitarias] = useState(false);

  // Buscar tipos de ingrediente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch("https://confeitaria-production.up.railway.app/api/ingrediente/buscar/tipo");
        if (!res.ok) throw new Error("Erro ao buscar tipos de ingrediente");
        const data: TipoIngredienteResponse[] = await res.json();
        setTipos(data);

        const etapasUnicas = Array.from(new Set(data.map(t => t.ingrediente.nome)));
        const initSelecionados: Record<string, string[]> = {};
        etapasUnicas.forEach(e => (initSelecionados[e] = []));
        setSelecionados(initSelecionados);
        setEtapa(etapasUnicas[0] || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  // --- Loading bonito para tipos ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Carregando tipos de ingredientes...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!etapa)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-700 text-lg">Nenhuma etapa encontrada</p>
      </div>
    );

  const steps = Array.from(new Set(tipos.map(t => t.ingrediente.nome)));
  const opcoes = steps.reduce((acc, step) => {
    const items = [...tipos.filter(t => t.ingrediente.nome === step)];
    if (step.toLowerCase() !== "massa" && step.toLowerCase() !== "tamanho") {
      items.push({ id: -1, nome: "Nenhum", ingrediente: { id_Ingrediente: 0, nome: step } });
    }
    acc[step] = items;
    return acc;
  }, {} as Record<string, TipoIngredienteResponse[]>);

  const currentStepIndex = steps.indexOf(etapa);
  const isFinalStep = currentStepIndex === steps.length - 1;

  const toggleSelecionado = (id: number) => {
    const valor = id.toString();
    setSelecionados(prev => {
      const atual = prev[etapa];
      if (valor === "-1") return { ...prev, [etapa]: ["-1"] };
      if (atual.includes("-1")) return { ...prev, [etapa]: [valor] };
      if (atual.includes(valor)) return { ...prev, [etapa]: atual.filter(x => x !== valor) };
      if (etapa.toLowerCase() === "recheio") {
        if (atual.length >= MAX_RECHEIOS) return prev;
        return { ...prev, [etapa]: [...atual, valor] };
      }
      return { ...prev, [etapa]: [valor] };
    });
  };

  const buscarConfeiteiros = async () => {
    setLoadingConfeitarias(true);
    try {
      const params = new URLSearchParams();
      const userStorage = localStorage.getItem("usuario");
      const user = JSON.parse(userStorage!);

      params.append("CodigoCliente", user.id.toString());
      tipos.forEach(t => params.append("CodigosTiposIngredientes", t.id.toString()));

      const res = await fetch(
        `https://confeitaria-production.up.railway.app/api/confeiteiro/buscar/confeiteiros-proximos?${params.toString()}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro API:", text);
        setConfeitarias([]);
        setMostrarConfeitarias(true);
        return;
      }

      const data = await res.json();
      setConfeitarias(data);
      setMostrarConfeitarias(true);
    } finally {
      setLoadingConfeitarias(false);
    }
  };

  const selecionarConfeiteiro = async (confeiteiroId: number) => {
    const userStorage = localStorage.getItem("usuario");
    const user = JSON.parse(userStorage!);

    const ingredientesSelecionadosIds = Object.values(selecionados)
      .flat()
      .map(x => parseInt(x))
      .filter(x => x !== -1);

    const body = {
      CodigoCliente: user.id,
      CodigoConfeiteiro: confeiteiroId,
      DataAtualizacao: dataEventoISO,
      CodigosTiposIngredientes: ingredientesSelecionadosIds,
    };

    const res = await fetch("https://confeitaria-production.up.railway.app/api/pedido/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      toast.error("Erro ao criar pedido: " + text);
      return;
    }

    toast.success("Pedido criado com sucesso!");
      router.push(ROUTES.INICIAR_PEDIDO);

  };

  const isNextDisabled =
    (etapa.toLowerCase() === "massa" && selecionados[etapa].length === 0) ||
    (etapa.toLowerCase() === "recheio" && selecionados[etapa].length === 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 max-w-7xl mx-auto px-6 pb-10">
        {!mostrarConfeitarias && (
          <div className="flex">
            <aside className="w-1/4 pr-8 border-r border-gray-200">
           <button
  onClick={() => {
    const currentIndex = steps.indexOf(etapa); // recalcula no clique
    if (currentIndex > 0) setEtapa(steps[currentIndex - 1]);
  }}
  className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
>
  <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
</button>

              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const active = step === etapa;
                  const completed = idx < currentStepIndex;

                  return (
                    <button
                      key={step}
                      disabled={!active && !completed}
                      onClick={() => (active || completed) && setEtapa(step)}
                      className={`
                        w-full py-3 rounded-lg text-lg transition
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

            <section className="flex-1 pl-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Selecione os {etapa.toLowerCase()}s
              </h1>
              <p className="text-gray-500 mb-8">
                {etapa.toLowerCase() === "recheio"
                  ? `Escolha até ${MAX_RECHEIOS} recheios`
                  : "Escolha uma opção"}
              </p>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {opcoes[etapa]?.map(item => {
                  const selected = selecionados[etapa]?.includes(item.id.toString());
                  return (
                    <label key={item.id} className="flex items-center space-x-4 text-lg py-2 cursor-pointer hover:opacity-80">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelecionado(item.id)}
                        className="w-5 h-5 border-gray-400 rounded"
                      />
                      <span>{item.nome}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end mt-10">
                {isFinalStep ? (
                  <button
                    onClick={buscarConfeiteiros}
                    disabled={loadingConfeitarias}
                    className="px-6 py-3 bg-purple-600 text-white rounded-full text-lg flex items-center justify-center"
                  >
                    {loadingConfeitarias && (
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    )}
                    {loadingConfeitarias ? "Buscando..." : "Buscar Confeitarias"}
                  </button>
                ) : (
                  <button
                    disabled={isNextDisabled}
                    onClick={() => setEtapa(steps[currentStepIndex + 1])}
                    className={`px-6 py-3 rounded-full text-lg
                      ${isNextDisabled ? "bg-gray-200 text-gray-500" : "bg-purple-500 text-white"}
                    `}
                  >
                    Avançar
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* LISTAGEM DE CONFEITEIROS */}
        {mostrarConfeitarias && (
          <div className="mt-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Confeitarias disponíveis</h1>

            {loadingConfeitarias && (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700">Buscando confeitarias...</p>
              </div>
            )}

            {!loadingConfeitarias && confeitarias.length === 0 && (
              <p>Nenhuma confeitaria encontrada</p>
            )}

            {!loadingConfeitarias && confeitarias.length > 0 && (
              <div className="space-y-4">
                {confeitarias.map(c => (
                  <div key={c.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold">{c.nomeCompleto}</p>
                    </div>
                    <button
                      onClick={() => selecionarConfeiteiro(c.id)}
                      className="px-4 py-2 rounded-full bg-purple-500 text-white"
                    >
                      Selecionar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
