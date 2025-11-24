"use client";

import { useState, useEffect } from "react";
import Header from "../../components/headerConfeiteira";
import { Calendar, Check, X } from "lucide-react";
import toast from "react-hot-toast";

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
  pagamento?: { valor: number; data: string } | null; // novo campo
};

interface Pedido {
  id: number;
  data: string;
  descricao: string;
  status: "pendente" | "aprovado" | "reprovado";
  tiposIngredientes: TipoIngrediente[];
  cliente: Cliente;
  pagamento: null | { valor: number; data: string }; // pagamento
}

interface PedidoCardProps {
  pedido: Pedido;
  onOpenModal: (p: Pedido) => void;
  onReprovar: (p: Pedido) => void;
}

const PedidoCard = ({ pedido, onOpenModal, onReprovar }: PedidoCardProps) => (
  <div className="p-3 rounded-lg shadow-sm bg-purple-100 text-purple-800 text-sm font-medium">
    <p className="font-bold mb-2">{pedido.descricao}</p>
    <p className="text-xs mb-1">Cliente: {pedido.cliente.nomeCompleto}</p>
    <p className="text-xs mb-2">
      Ingredientes: {pedido.tiposIngredientes.map(t => `${t.nome} - ${t.ingrediente.nome}`).join(", ")}
    </p>

    <div className="flex justify-between space-x-2 mt-2">
      {pedido.pagamento ? (
        <span className="w-full text-center font-semibold uppercase text-xs p-1 rounded-full bg-green-500 text-white">
          Aprovado
        </span>
      ) : pedido.status === "pendente" ? (
        <>
          <button
            onClick={() => onOpenModal(pedido)}
            className="flex items-center justify-center flex-1 py-1 bg-white text-green-600 rounded-full hover:bg-gray-100 transition-colors border border-green-300"
          >
            <Check className="w-4 h-4 mr-1" /> Aprovar
          </button>

          <button
            onClick={() => onReprovar(pedido)}
            className="flex items-center justify-center flex-1 py-1 bg-white text-red-600 rounded-full hover:bg-gray-100 transition-colors border border-red-300"
          >
            <X className="w-4 h-4 mr-1" /> Reprovar
          </button>
        </>
      ) : (
        <span
          className={`w-full text-center font-semibold uppercase text-xs p-1 rounded-full ${
            pedido.status === "aprovado" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {pedido.status === "aprovado" ? "Aprovado" : "Reprovado"}
        </span>
      )}
    </div>
  </div>
);

export default function Agenda() {
  const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [primeiroDia, setPrimeiroDia] = useState(new Date());
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [valorOrcamento, setValorOrcamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [idConfeiteiro, setIdConfeiteiro] = useState<number | null>(null);

  useEffect(() => {
    const userStorage = localStorage.getItem("usuario");
    if (userStorage) {
      const user: UserStorage = JSON.parse(userStorage);
      setIdConfeiteiro(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!idConfeiteiro) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://confeitaria-production.up.railway.app/api/pedido/buscar/confeiteiro/${idConfeiteiro}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data: PedidoResponse[] = await res.json();
        const pedidosMapeados: Pedido[] = data.map(p => ({
          id: p.id,
          data: p.dataAtualizacao.split("T")[0],
          descricao: `Pedido #${p.id}`,
          status: p.status.toLowerCase() as "pendente" | "aprovado" | "reprovado",
          tiposIngredientes: p.tiposIngredientes,
          cliente: p.cliente,
          pagamento: p.pagamento ?? null,
        }));
console.log("res", data)

        setPedidos(pedidosMapeados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [primeiroDia, idConfeiteiro]);

  const openModal = (p: Pedido) => {
    setPedidoSelecionado(p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setValorOrcamento("");
    setObservacoes("");
  };

  const enviarOrcamento = async () => {
    if (!pedidoSelecionado) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("https://confeitaria-production.up.railway.app/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ valor: Number(valorOrcamento), codigoPedido: pedidoSelecionado.id }),
      });
      setPedidos(prev =>
        prev.map(p =>
          p.id === pedidoSelecionado.id ? { ...p, status: "aprovado", pagamento: { valor: Number(valorOrcamento), data: new Date().toISOString() } } : p
        )
      );
      closeModal();
      toast.success("Pedido aprovado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar orçamento");
    } finally {
      setLoading(false);
    }
  };

  const handleReprovar = async (pedido: Pedido) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("https://confeitaria-production.up.railway.app/api/pedido/alterar/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "recusado", codigoPedido: pedido.id }),
      });
      setPedidos(prev =>
        prev.map(p => (p.id === pedido.id ? { ...p, status: "reprovado" } : p))
      );
      toast.success("Pedido reprovado");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao reprovar pedido");
    } finally {
      setLoading(false);
    }
  };

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

        {modalOpen && pedidoSelecionado && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enviar Orçamento</h2>

              <p className="text-sm text-gray-600 mb-4">
                Pedido selecionado: <span className="font-semibold">{pedidoSelecionado.descricao}</span>
              </p>

              <label className="block mb-3 text-gray-700 text-sm">Valor do orçamento (R$)</label>
              <input
                type="number"
                value={valorOrcamento}
                onChange={e => setValorOrcamento(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500"
              />

              <label className="block mt-4 mb-2 text-gray-700 text-sm">Observações (opcional)</label>
              <textarea
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                className="w-full px-3 py-2 h-24 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex justify-end mt-6 space-x-3">
                <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">
                  Cancelar
                </button>
                <button onClick={enviarOrcamento} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                  Enviar Orçamento
                </button>
              </div>
            </div>
          </div>
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
                    <p className="text-lg font-extrabold text-gray-800">{dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</p>
                  </div>

                  <div className="space-y-3 p-3">
                    {pedidosDoDia.map(pedido => (
                      <PedidoCard key={pedido.id} pedido={pedido} onOpenModal={openModal} onReprovar={handleReprovar} />
                    ))}

                    {pedidosDoDia.length === 0 && <p className="text-center text-gray-400 text-sm italic mt-4">Nenhum pedido agendado.</p>}
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
