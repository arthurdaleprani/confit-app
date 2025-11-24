"use client";

import { NextPage } from "next";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PedidosAguardandoPagamento: NextPage = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStorage = localStorage.getItem("usuario");
    if (!userStorage) return;

    const user = JSON.parse(userStorage);

    fetch(`https://confeitaria-production.up.railway.app/api/pedido/buscar/cliente/${user.id}`)
      .then(r => r.json())
      .then(data => {
        console.log("API =>", data);
        setPedidos(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAceitar = async (pedido: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://confeitaria-production.up.railway.app/api/pedido/alterar/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Em Preparação", codigoPedido: pedido.id }),
        }
      );
      if (!res.ok) throw new Error("Erro ao aceitar pedido");

      // Atualiza o status no state
      setPedidos(prev =>
        prev.map(p => (p.id === pedido.id ? { ...p, status: "Em Preparação" } : p))
      );

      toast.success("Pedido aceito e em preparação!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao aceitar pedido");
    }
  };

  const handleRecusar = async (pedido: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://confeitaria-production.up.railway.app/api/pedido/alterar/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Recusado", codigoPedido: pedido.id }),
        }
      );
      if (!res.ok) throw new Error("Erro ao recusar pedido");

      setPedidos(prev =>
        prev.map(p => (p.id === pedido.id ? { ...p, status: "Recusado" } : p))
      );

      toast.success("Pedido recusado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao recusar pedido");
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pedidos aguardando pagamento
        </h1>

        {loading && (
          <p className="text-gray-700 text-center text-lg">Carregando...</p>
        )}

        {!loading && pedidos.filter(p => p.status === "Pendente").length === 0 && (
          <p className="text-gray-600 text-center text-lg">
            Nenhum pedido aguardando pagamento no momento.
          </p>
        )}

        {!loading &&
          pedidos
            .filter(p => p.status === "Pendente" || p.status === "Em Preparação")
            .map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow p-6 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Pedido #{p.id}
                </h2>

                <p className="text-gray-700">
                  <span className="font-medium">Status:</span> {p.status}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">Data:</span>{" "}
                  {new Date(p.dataAtualizacao).toLocaleDateString()}
                </p>

                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Ingredientes:</span>
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  {p.tiposIngredientes?.map((t: any) => (
                    <li key={t.id}>
                      <b>{t.ingrediente?.nome}</b> — {t.nome}
                    </li>
                  ))}
                </ul>

                {p.pagamento?.valor && p.status === "Pendente" ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAceitar(p)}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleRecusar(p)}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                      Recusar
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
      </div>
    </div>
  );
};

export default PedidosAguardandoPagamento;
