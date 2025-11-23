"use client";

import { NextPage } from "next";
import Header from "../../components/header";
import { useEffect, useState } from "react";

import { Calendar, Clock, Check, DollarSign, MapPin } from "lucide-react";

interface Pedido {
    id: number;
    status: string;
    dataAtualizacao: string;
    confeiteiro: {
        nomeCompleto: string;
        endereco?: {
            estado?: string;
            cidade?: string;
        }
    },
    tiposIngredientes: {
        id: number;
        nome: string;
        ingrediente: {
            nome: string;
        }
    }[];
}

export default function HistoricoPedidos() {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const userRaw = localStorage.getItem("usuario");
        if (!userRaw) return;

        const user = JSON.parse(userRaw);

        fetch(`https://localhost:7039/api/pedido/buscar/cliente/${user.id}`)
            .then(r => r.json())
            .then(data => {
                setPedidos(data);
                if (data.length > 0)
                    setSelected(data[0].id);
            })
            .finally(() => setLoading(false));

    }, []);

    const atual = pedidos.find(x => x.id === selected);

    return (
        <div className="min-h-screen bg-gray-50">

            <Header />

            <div className="max-w-6xl mx-auto py-4 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* coluna esquerda */}
                <div className="lg:col-span-1 space-y-2 pt-4">

                    {loading && <p>Carregando...</p>}

                    {!loading && pedidos.length === 0 && (
                        <p>Você ainda não fez pedidos.</p>
                    )}

                    {pedidos.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelected(p.id)}
                            className={`w-full py-3 px-4 rounded-xl text-left transition-all duration-200 shadow-sm text-lg
                                ${selected === p.id
                                    ? 'bg-purple-400 text-white font-bold shadow-md'
                                    : 'bg-white text-purple-700 hover:bg-gray-100'
                                }`}
                        >
                            Pedido #{p.id}
                        </button>
                    ))}

                </div>

                {/* detalhes */}
                {atual && (
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* bloco 1 */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações do pedido</h2>

                            <div className="space-y-3 text-gray-700">

                                <p>
                                    <b>Status:</b> {atual.status}
                                </p>

                                <p>
                                    <b>Data:</b> {new Date(atual.dataAtualizacao).toLocaleDateString()}
                                </p>

                                <p>
                                    <b>Confeitaria:</b> {atual.confeiteiro?.nomeCompleto}
                                </p>

                                {atual.confeiteiro?.endereco && (
                                    <>
                                        <p><b>Cidade:</b> {atual.confeiteiro.endereco.cidade}</p>
                                        <p><b>Estado:</b> {atual.confeiteiro.endereco.estado}</p>
                                    </>
                                )}

                            </div>

                        </div>

                        {/* bloco 2 */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredientes escolhidos</h2>

                            <ul className="list-disc pl-6 space-y-1 text-gray-700">

                                {atual.tiposIngredientes.map(t => (
                                    <li key={t.id}>
                                        <b>{t.nome}</b> — {t.ingrediente.nome}
                                    </li>
                                ))}

                            </ul>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}
