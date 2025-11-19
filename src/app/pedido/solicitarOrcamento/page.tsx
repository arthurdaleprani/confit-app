import { NextPage } from "next";
import { Star } from "lucide-react";
import Header from "../../components/header";

// Cores base da imagem (roxo claro/suave)
const PURPLE_BUTTON_BG = '#D7C3F8'; // Roxo claro de fundo do botão (aproximado)
const PURPLE_HIGHLIGHT = '#5B21B6';  // Roxo escuro para o título (text-purple-800)

// Mock Data para as informações do bolo (Mantido)
const cakeInfo = {
    massa: "Chocolate",
    recheio: "Brigadeiro, Geleia de Morango",
    decoracao: {
        tamanho: "30 cm",
        tipo: "Naked Cake",
    }
};

// Mock Data para as confeitarias (Mantido)
const confeitariasData = [
    {
        nome: "Adoçare",
        distancia: "5 km de distância",
        avaliacao: 4.9,
        imageUrl: "Logo Adoçare - Bolo Rosa", 
    },
    {
        nome: "Bela Doceria",
        distancia: "0.9 km de distância",
        avaliacao: 4.9,
        imageUrl: "Logo Bela Doceria - Taça de Bolo",
    },
    {
        nome: "Chocolate Doceria",
        distancia: "1.5 km de distância",
        avaliacao: 4.5,
        imageUrl: "Logo Chocolate Doceria",
    },
];

const Confeitarias: NextPage = () => {
    
    // Componente estilizado para o Card de Confeitaria (REVISADO)
    const ConfeitariaCard = ({ nome, distancia, avaliacao, imageUrl }: typeof confeitariasData[0]) => (
        // O card é agora um container flexível com margens internas e barra sutil
        <div className="flex bg-white rounded-xl shadow-md border border-gray-100 w-full relative h-36 overflow-hidden transition-shadow hover:shadow-lg">
            
            {/* Área de Imagem (Tamanho Fixo e Proporcional) */}
            <div className="w-36 flex-shrink-0 p-4 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 p-1 text-center">
                    
                </div>
            </div>

            {/* Conteúdo e Botão (Horizontalmente dividido) */}
            <div className="flex-grow flex justify-between items-center pr-6 py-4">
                
                {/* Informações (Nome, Distância, Avaliação) */}
                <div className="flex flex-col justify-center h-full">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {nome}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">{distancia}</p>
                    
                    {avaliacao && (
                        <div className="flex items-center text-gray-700 mt-2">
                            {/* Estrela de avaliação mais limpa e visível */}
                            <Star className="w-4 h-4 fill-gray-900 text-gray-900 mr-1" /> 
                            <span className="font-semibold text-sm">{avaliacao.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Botão Solicitar Orçamento (Alinhado à direita e centralizado) */}
                <div className="flex items-center justify-end h-full">
                     <button 
                        className="px-6 py-3 w-56 text-center rounded-lg hover:opacity-80 transition-opacity font-semibold text-base"
                        style={{ backgroundColor: PURPLE_BUTTON_BG, color: 'white' }}
                    >
                        Solicitar Orçamento
                    </button>
                </div>
            </div>
            
            {/* Barra lateral sutil à direita do card (fiel à imagem) */}
            <div className="absolute top-0 right-0 w-1 bg-purple-500 bg-opacity-10 h-full rounded-r-xl"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Container principal para o layout de duas colunas */}

                                <Header />
            
            <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
                
                {/* Coluna 1: Informações do Bolo (Fiel à Imagem) */}
                <div className="lg:col-span-1 border-r border-gray-200 pr-8">
                    <h3 className="font-medium text-gray-700 mb-6 text-sm uppercase">
                        Informações sobre o seu bolo:
                    </h3>
                    
                    <div className="space-y-6 text-sm">
                        <div className="leading-snug">
                            <p className="font-bold text-gray-900">Massa:</p>
                            <p className="text-gray-900">{cakeInfo.massa}</p>
                        </div>
                        
                        <div className="leading-snug">
                            <p className="font-bold text-gray-900">Recheio:</p>
                            <p className="text-gray-900">{cakeInfo.recheio}</p>
                        </div>

                        <div className="leading-snug">
                            <p className="font-bold text-gray-900">Decoração:</p>
                            <ul className="list-none space-y-1 text-gray-900">
                                <li>
                                    <span className="text-gray-700">1. Tamanho do Bolo:</span>
                                    <span className="ml-1 font-bold text-gray-900">{cakeInfo.decoracao.tamanho}</span>
                                </li>
                                <li>
                                    <span className="text-gray-700">2. Tipo decoração:</span>
                                    <span className="ml-1 font-bold text-gray-900">{cakeInfo.decoracao.tipo}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Lista de Confeitarias */}
                <div className="lg:col-span-3">
                    {/* Título com destaque de cor */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                        Confeitarias que fazem o seu <span style={{ color: PURPLE_HIGHLIGHT }}>Bolo Perfeito</span>
                    </h1>

                    {/* Lista de Cards */}
                    <div className="space-y-4">
                        {confeitariasData.map((confeitaria) => (
                            <ConfeitariaCard key={confeitaria.nome} {...confeitaria} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confeitarias;