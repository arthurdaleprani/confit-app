"use client";

import { NextPage } from "next";
import Header from "../../components/header";
import { useEffect, useState } from "react";

const PedidosAguardandoPagamento: NextPage = () => {

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userStorage = localStorage.getItem("usuario");
    if (!userStorage) return;

    const user = JSON.parse(userStorage);

    fetch(`https://localhost:7039/api/pedido/buscar/cliente/${user.id}`)
      .then(r => r.json())
      .then(data => {
        console.log("API =>", data);
        setPedidos(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, []);


  // STATUS CORRETO
  const aguardandoPagamento = pedidos.filter(p => p.status === "Pendente");
console.log("p", pedidos)


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

        {!loading && aguardandoPagamento.length === 0 && (
          <p className="text-gray-600 text-center text-lg">
            Nenhum pedido aguardando pagamento no momento.
          </p>
        )}

        {!loading && aguardandoPagamento.length > 0 && (
          <div className="space-y-6 mb-8">

            {aguardandoPagamento.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow p-6">

                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Pedido #{p.id}
                </h2>

                <p className="text-gray-700">
                  <span className="font-medium">Status:</span> {p.status}
                </p>

                <p className="text-gray-700">
                  <span className="font-medium">Data:</span> {new Date(p.dataAtualizacao).toLocaleDateString()}
                </p>

                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Ingredientes:</span>
                </p>

<ul className="list-disc pl-6 text-gray-700">
  {p.tiposIngredientes?.map((t: any) => (
    <li key={t.id}>
      <b>{t.ingrediente?.nome}</b> — {t.nome}
    </li>
  ))}
</ul>


              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default PedidosAguardandoPagamento;
