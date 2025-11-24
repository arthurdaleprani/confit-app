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
  pagamento?: { valor: number; data?: string } | null;
};

interface Pedido {
  id: number;
  data: string;
  descricao: string;
  status: "aprovado" | "reprovado" | "outro";
  tiposIngredientes: TipoIngrediente[];
  cliente: Cliente;
  pagamento: null | { valor: number; data?: string };
}

// Card simplificado para apenas exibir os dados
const PedidoCard = ({ pedido }: { pedido: Pedido }) => (
  <div className="p-3 rounded-lg shadow-sm bg-purple-100 text-purple-800 text-sm font-medium">
    <p className="font-bold mb-2">{pedido.descricao}</p>
    <p className="text-xs mb-1">Cliente: {pedido.cliente.nomeCompleto}</p>
    <p className="text-xs mb-2">
      Ingredientes: {pedido.tiposIngredientes.map(t => `${t.nome} - ${t.ingrediente.nome}`).join(", ")}
    </p>
    {pedido.pagamento && pedido.pagamento.valor && pedido.pagamento.data && (
      <p className="text-xs mb-2">
        Pagamento: R$ {pedido.pagamento.valor} em{" "}
        {new Date(pedido.pagamento.data).toLocaleDateString("pt-BR")}
      </p>
    )}
    <span
      className={`w-full text-center font-semibold uppercase text-xs p-1 rounded-full ${
        pedido.status === "aprovado"
          ? "bg-green-500 text-white"
          : pedido.status === "reprovado"
          ? "bg-red-500 text-white"
          : "bg-yellow-400 text-white"
      }`}
    >
      {pedido.status === "aprovado"
        ? "Aprovado"
        : pedido.status === "reprovado"
        ? "Reprovado"
        : "Em Preparação"}
    </span>
  </div>
);

export default function Agenda() {
  const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [primeiroDia, setPrimeiroDia] = useState(new Date());
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      const userStorage = localStorage.getItem("usuario");
      if (!userStorage) return;

      const user: UserStorage = JSON.parse(userStorage);
      const idConfeiteiro = user.id;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://confeitaria-production.up.railway.app/api/pedido/buscar/confeiteiro/${idConfeiteiro}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data: PedidoResponse[] = await res.json();
        console.log("data", data);

        const pedidosMapeados: Pedido[] = data
          .filter(p => p.status !== "Pendente" && p.status !== "Recusado" ) // remove pendentes
          .map(p => ({
            id: p.id,
            data: p.dataAtualizacao.split("T")[0],
            descricao: `Pedido #${p.id}`,
            status:
              p.status
                ? "aprovado"
                : p.status
                ? "reprovado"
                : "outro",
            tiposIngredientes: p.tiposIngredientes,
            cliente: p.cliente,
            pagamento: p.pagamento ?? null,
          }));

        setPedidos(pedidosMapeados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [primeiroDia]);

  const nextWeek = () =>
    setPrimeiroDia(d => {
      const newD = new Date(d);
      newD.setDate(newD.getDate() + 5);
      return newD;
    });

  const prevWeek = () =>
    setPrimeiroDia(d => {
      const newD = new Date(d);
      newD.setDate(newD.getDate() - 5);
      return newD;
    });

  const diasSemana = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(primeiroDia);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto w-full py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-8 h-8 mr-3 text-purple-600" /> Agenda Semanal de Produção
        </h1>

        <div className="flex justify-between mb-6">
          <button onClick={prevWeek} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            ← Semana anterior
          </button>
          <button onClick={nextWeek} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Próxima semana →
          </button>
        </div>

        {loading && (
          <p className="text-center text-purple-600 font-bold animate-pulse mb-4">Carregando pedidos...</p>
        )}

        <section className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-5 border-t border-gray-200">
            {diasSemana.map(dia => {
              const dateObj = new Date(dia);
              const diaNome = diasSemanaNomes[dateObj.getDay()];
              const pedidosDoDia = pedidos.filter(p => p.data === dia);

              return (
                <div key={dia} className="min-h-[400px] border-r border-gray-200 last:border-r-0 bg-white">
                  <div className="text-center py-3 border-b-4 border-gray-100">
                    <p className="text-xs uppercase font-bold text-gray-500">{diaNome}</p>
                    <p className="text-lg font-extrabold text-gray-800">
                      {dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </p>
                  </div>

                  <div className="space-y-3 p-3">
                    {pedidosDoDia.length > 0 ? (
                      pedidosDoDia.map(pedido => <PedidoCard key={pedido.id} pedido={pedido} />)
                    ) : (
                      <p className="text-center text-gray-400 text-sm italic mt-4">Nenhum pedido agendado.</p>
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
