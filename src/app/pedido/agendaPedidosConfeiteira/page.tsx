"use client";
import { useState, useEffect } from "react";
import Header from "../../components/headerConfeiteira";
import { Calendar } from "lucide-react";

type UserStorage = {
  id: number;
  nomeCompleto: string;
};

type Cliente = {
  id: number;
  nomeCompleto: string;
};

type Ingrediente = {
  id: number;
  nome: string;
};

type TipoIngrediente = {
  id: number;
  nome: string;
  ingrediente: Ingrediente;
};

type PedidoResponse = {
  id: number;
  dataAtualizacao: string;
  cliente: Cliente;
  tiposIngredientes: TipoIngrediente[];
  status: string;
};

export default function Agenda() {
  const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [primeiroDia, setPrimeiroDia] = useState(new Date());

  const [user, setUser] = useState<UserStorage | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const diasSemana = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(primeiroDia);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const fetchPedidos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:7039/api/pedido/buscar/confeiteiro/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Erro ao buscar pedidos");

      const data: PedidoResponse[] = await res.json();

      // Ignora pedidos pendentes ou reprovados
      setPedidos(
        data.filter(
          p =>
            p.status.toLowerCase() !== "pendente" &&
            p.status.toLowerCase() !== "reprovado"
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [user, primeiroDia]);

  const nextWeek = () => {
    setPrimeiroDia(d => {
      const newD = new Date(d);
      newD.setDate(newD.getDate() + 5);
      return newD;
    });
  };

  const prevWeek = () => {
    setPrimeiroDia(d => {
      const newD = new Date(d);
      newD.setDate(newD.getDate() - 5);
      return newD;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto w-full py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-8 h-8 mr-3 text-purple-600" /> Agenda Semanal de Pedidos
        </h1>

        <div className="flex justify-between mb-6">
          <button
            onClick={prevWeek}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Semana anterior
          </button>
          <button
            onClick={nextWeek}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Próxima semana →
          </button>
        </div>

        {/* --- Loading Spinner --- */}
        {loading && (
          <div className="flex justify-center items-center my-6">
            <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-purple-600 font-semibold">
              Carregando pedidos...
            </span>
          </div>
        )}

        <section className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-5 border-t border-gray-200">
            {diasSemana.map((dia, index) => {
              const dateObj = new Date(dia);
              const diaNome = diasSemanaNomes[dateObj.getDay()];
              const isToday = index === 0;
              const pedidosDoDia = pedidos.filter(
                p => p.dataAtualizacao.split("T")[0] === dia
              );

              return (
                <div
                  key={dia}
                  className={`min-h-[300px] border-r border-gray-200 last:border-r-0 ${
                    isToday ? "bg-purple-50" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-center py-3 border-b-4 ${
                      isToday ? "border-purple-600" : "border-gray-100"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase font-bold ${
                        isToday ? "text-purple-600" : "text-gray-500"
                      }`}
                    >
                      {diaNome}
                    </p>
                    <p
                      className={`text-lg font-extrabold ${
                        isToday ? "text-purple-900" : "text-gray-800"
                      }`}
                    >
                      {dateObj.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="space-y-3 p-3">
                    {pedidosDoDia.length > 0 ? (
                      pedidosDoDia.map(pedido => (
                        <div
                          key={pedido.id}
                          className={`rounded-xl py-2 px-4 font-semibold ${
                            pedido.status.toLowerCase() === "aprovado"
                              ? "bg-green-500 text-white"
                              : "bg-purple-200 text-white"
                          }`}
                        >
                          <p>Pedido #{pedido.id}</p>
                          <p>Cliente: {pedido.cliente.nomeCompleto}</p>
                          <p>Status: {pedido.status}</p>
                          <p>
                            Ingredientes:{" "}
                            {pedido.tiposIngredientes
                              .map(t => `${t.nome} - ${t.ingrediente.nome}`)
                              .join(", ")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 text-sm italic mt-4">
                        Nenhum pedido agendado.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
