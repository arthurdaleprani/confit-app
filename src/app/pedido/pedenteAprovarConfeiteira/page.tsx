"use client";
import Link from "next/link";
import { User, Calendar, Check, X } from "lucide-react"; 
import { useState, useEffect } from "react"; // Adicionado useEffect
import Header from "../../components/header"; 

// --- Tipagem Aprimorada ---
type Pedido = {
    id: number;
    data: string; 
    descricao: string;
    status: 'pendente' | 'aprovado' | 'reprovado';
};

// Componente para o Card de Pedido Individual
interface PedidoCardProps {
    pedido: Pedido;
    onAprovar: (id: number) => void;
    onReprovar: (id: number) => void;
}

const PedidoCard = ({ pedido, onAprovar, onReprovar }: PedidoCardProps) => {
    let bgColor = 'bg-purple-100';
    let textColor = 'text-purple-800';

    if (pedido.status === 'aprovado') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
    } else if (pedido.status === 'reprovado') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
    }

    return (
        <div className={`p-3 rounded-lg shadow-sm ${bgColor} ${textColor} text-sm font-medium`}>
            <p className="font-bold mb-2">{pedido.descricao}</p>
            
            <div className="flex justify-between space-x-2 mt-2">
                {pedido.status === 'pendente' ? (
                    <>
                        <button 
                            onClick={() => onAprovar(pedido.id)}
                            className="flex items-center justify-center flex-1 py-1 bg-white text-green-600 rounded-full hover:bg-gray-100 transition-colors border border-green-300"
                        >
                            <Check className="w-4 h-4 mr-1" /> Aprovar
                        </button>
                        <button 
                            onClick={() => onReprovar(pedido.id)}
                            className="flex items-center justify-center flex-1 py-1 bg-white text-red-600 rounded-full hover:bg-gray-100 transition-colors border border-red-300"
                        >
                            <X className="w-4 h-4 mr-1" /> Reprovar
                        </button>
                    </>
                ) : (
                    <span className={`w-full text-center font-semibold uppercase text-xs p-1 rounded-full ${pedido.status === 'aprovado' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {pedido.status === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Agenda() {
    // --- Dados e Lógica de Data ---
    const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Gera os próximos 5 dias a partir de hoje
    const diasSemana = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0]; 
    });

    // Estado inicial dos pedidos
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    // Função para simular o preenchimento inicial dos pedidos com datas
    const initializePedidos = () => {
        const initialPedidos: Pedido[] = [
            { id: 23456, data: diasSemana[1], descricao: "Pedido: #23456 (Brigadeiro)", status: 'pendente' },
            { id: 1235, data: diasSemana[1], descricao: "Pedido: #1235 (Baunilha)", status: 'pendente' },
            { id: 7890, data: diasSemana[2], descricao: "Pedido: #7890 (Red Velvet)", status: 'pendente' },
            { id: 9999, data: diasSemana[3], descricao: "Pedido: #9999 (Aprovado)", status: 'aprovado' },
            { id: 1111, data: diasSemana[4], descricao: "Pedido: #1111 (Reprovado)", status: 'reprovado' },
        ];
        setPedidos(initialPedidos);
    };

    // --- CORREÇÃO DO ERRO: Usa useEffect para inicializar os dados apenas na montagem ---
    useEffect(() => {
        initializePedidos();
    }, []); 

    // --- Lógica de Ações ---
    const handleAprovar = (id: number) => {
        setPedidos(prev => 
            prev.map(p => p.id === id ? { ...p, status: 'aprovado' } : p)
        );
    };

    const handleReprovar = (id: number) => {
        setPedidos(prev => 
            prev.map(p => p.id === id ? { ...p, status: 'reprovado' } : p)
        );
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto w-full py-8 px-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-purple-600" /> Agenda Semanal de Produção
                </h1>

                <section className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-5 border-t border-gray-200">
                        {diasSemana.map((dia, index) => {
                            const dateObj = new Date(dia);
                            const diaNome = diasSemanaNomes[dateObj.getDay()];
                            const isToday = index === 0;

                            return (
                                <div key={dia} className={`min-h-[400px] border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-purple-50' : 'bg-white'}`}>
                                    
                                    {/* Cabeçalho do Dia */}
                                    <div className={`text-center py-3 border-b-4 ${isToday ? 'border-purple-600' : 'border-gray-100'}`}>
                                        <p className={`text-xs uppercase font-bold ${isToday ? 'text-purple-600' : 'text-gray-500'}`}>
                                            {diaNome}
                                        </p>
                                        <p className={`text-lg font-extrabold ${isToday ? 'text-purple-900' : 'text-gray-800'}`}>
                                            {dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                        </p>
                                    </div>

                                    {/* Lista de Pedidos */}
                                    <div className="space-y-3 p-3">
                                        {pedidos
                                            .filter((p) => p.data === dia)
                                            .map((pedido) => (
                                                <PedidoCard 
                                                    key={pedido.id}
                                                    pedido={pedido}
                                                    onAprovar={handleAprovar}
                                                    onReprovar={handleReprovar}
                                                />
                                            ))}
                                        {pedidos.filter((p) => p.data === dia).length === 0 && (
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