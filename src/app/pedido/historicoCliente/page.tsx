"use client";
import Link from "next/link";
import { User, Calendar, Clock, DollarSign, MapPin, Check, LucideIcon } from "lucide-react";
import { useState } from "react";

// Tipagem mantida
interface OrderData {
    dataEntrega: string;
    status: string;
    pagamento: string;
    preco: string;
    estado: string;
    cidade: string;
    massa: string;
    recheios: string;
    formato: string;
    tamanho: string;
    descricaoDecoracao: string;
    confeitaria: string;
}

type OrderDetailsMap = {
    [key: string]: OrderData | {};
};

// Componente ConfITIcon (Mantido)
const ConfITIcon = () => (
    <div className="flex items-center space-x-1">
        <div className="w-5 h-5 bg-white rounded-full border-2 border-purple-300 flex items-center justify-center shadow-inner">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        </div>
        <span className="font-bold text-lg text-purple-700">ConfIT</span>
    </div>
);

// Tipagem e Componente DetailItem (Mantido, mas estilizado)
interface DetailItemProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
    <div className="flex items-center space-x-3 text-gray-700">
        <Icon className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <span className="font-medium">{label}:</span>
        <span className="flex-1 text-right">{value}</span>
    </div>
);

// Tipagem e Componente CakeDetailItem (Mantido, mas estilizado)
interface CakeDetailItemProps {
    label: string;
    value: string;
}

const CakeDetailItem = ({ label, value }: CakeDetailItemProps) => (
    <div className="flex justify-between items-start text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
        <span className="font-medium text-base text-gray-600">{label}:</span>
        <span className="text-base font-semibold text-right max-w-[50%]">{value}</span>
    </div>
);


export default function HistoricoPedidos() {
    const [selectedOrder, setSelectedOrder] = useState<string>('12345');

    const orderDetails: OrderDetailsMap = {
        '12345': {
            dataEntrega: "19/02/2025",
            status: "Entregue",
            pagamento: "Confirmado",
            preco: "R$ 178,90",
            estado: "Espírito Santo",
            cidade: "Vila Velha",
            massa: "Chocolate",
            recheios: "Brigadeiro e Paçoca",
            formato: "Coração",
            tamanho: "15 centímetro",
            descricaoDecoracao: "Azul vintage com laço",
            confeitaria: "Confetty",
        } as OrderData,
        '23456': {
            dataEntrega: "10/01/2025",
            status: "Pendente",
            pagamento: "Não Confirmado",
            preco: "R$ 210,00",
            estado: "Espírito Santo",
            cidade: "Serra",
            massa: "Baunilha",
            recheios: "Ninho e Morango",
            formato: "Redondo",
            tamanho: "25 centímetro",
            descricaoDecoracao: "Branco simples com flores",
            confeitaria: "Doce Arte",
        } as OrderData,
        '34567': { },
        '45678': { },
    }

    // Assumimos que, se o pedido não estiver totalmente preenchido, ele exibe '12345'
    const currentOrder = (orderDetails[selectedOrder] as OrderData) || orderDetails['12345'] as OrderData; 
    
    // Objeto para navegação da Navbar
    const navItems = [
        { label: "Histórico de pedidos", href: "#historico" },
        { label: "Pedidos a pagar", href: "#pagar" },
        { label: "Fale Conosco", href: "#contato" },
    ];


    return (
        <div className="min-h-screen bg-gray-50">
       

{/* 2. Banner/Título Principal */}
<div className="bg-purple-600 p-4 mb-10 shadow-lg">
    <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white py-1">Histórico de pedidos</h1>
    </div>
</div>
            {/* 3. Conteúdo Principal (Layout de 3 colunas visualmente) */}
            <div className="max-w-6xl mx-auto py-4 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Coluna 1: Lista de Pedidos (Estilo dos botões) */}
                <div className="lg:col-span-1 space-y-2 pt-4">
                    {['12345', '23456', '34567', '45678'].map((id) => (
                        <button
                            key={id}
                            onClick={() => setSelectedOrder(id)}
                            className={`w-full py-3 px-4 rounded-xl text-left transition-all duration-200 
                                shadow-sm text-lg
                                ${selectedOrder === id 
                                    ? 'bg-purple-400 text-white font-bold shadow-md' 
                                    : 'bg-white text-purple-700 hover:bg-gray-100'
                                }`}
                        >
                            Pedido: #{id}
                        </button>
                    ))}
                </div>

                {/* Coluna 2 & 3: Detalhes e Descritivo (Organizados em 2 colunas) */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Card 1: Detalhes do pedido */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do pedido</h2>
                        
                        <div className="space-y-4">
                            <DetailItem icon={Calendar} label="Data da entrega" value={currentOrder.dataEntrega} />
                            <DetailItem icon={Clock} label="Status do pedido" value={currentOrder.status} />
                            <DetailItem icon={Check} label="Pagamento" value={currentOrder.pagamento} />
                            <DetailItem icon={DollarSign} label="Preço" value={currentOrder.preco} />
                            <DetailItem icon={MapPin} label="Estado" value={currentOrder.estado} />
                            <DetailItem icon={MapPin} label="Cidade" value={currentOrder.cidade} />
                        </div>
                        {/* Adicionar botão de Acompanhar/Recomprar se necessário */}
                    </div>

                    {/* Card 2: Descritivo do Bolo */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Descritivo do Bolo</h2>
                        
                        <div className="space-y-2">
                            <CakeDetailItem label="Massa" value={currentOrder.massa} />
                            <CakeDetailItem label="Recheio(s)" value={currentOrder.recheios} />
                            <CakeDetailItem label="Formato" value={currentOrder.formato} />
                            <CakeDetailItem label="Tamanho" value={currentOrder.tamanho} />
                            <CakeDetailItem label="Descrição da decoração" value={currentOrder.descricaoDecoracao} />
                            <CakeDetailItem label="Confeitaria escolhida" value={currentOrder.confeitaria} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}