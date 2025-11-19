"use client";
import Link from "next/link";
import { User, ChevronLeft, ChevronRight, Check } from "lucide-react"; 
import { useState, useMemo } from "react";
import ROUTES from "@/app/routes";
import Header from "../../components/header";

type Etapa = "Massa" | "Recheio" | "Decoração";

const opcoes: Record<Etapa, string[]> = {
    Massa: ["Chocolate", "Baunilha", "Red Velvet"],
    Recheio: ["Brigadeiro", "Paçoca", "Pistache", "Doce de Leite", "Avelã Crocante", "Caramelo Salgado", "Ninho"],
    Decoração: ["Frutas", "Granulado", "Chantilly"],
};

const NEXT_PAGE_URL = ROUTES.AGN_PED_CONF;

export default function MontarBolo() {
    const [etapa, setEtapa] = useState<Etapa>("Recheio"); 
    const [selecionados, setSelecionados] = useState<Record<Etapa, string[]>>({
        Massa: [],
        Recheio: ["Brigadeiro", "Paçoca"],
        Decoração: [],
    });

    const steps: Etapa[] = ["Massa", "Recheio", "Decoração"];
    const currentStepIndex = steps.indexOf(etapa);
    
    const MAX_RECHEIOS = 3; 

    const toggleSelecionado = (item: string) => {
        setSelecionados(prev => {
            const currentSelected = prev[etapa];

            if (currentSelected.includes(item)) {
                return { ...prev, [etapa]: currentSelected.filter((i) => i !== item) };
            } else {
                if (etapa === "Recheio" && currentSelected.length >= MAX_RECHEIOS) {
                    return prev;
                }
                // Garante que apenas um item de Massa seja selecionado (se necessário)
                if (etapa === "Massa") {
                    return { ...prev, [etapa]: [item] };
                }
                return { ...prev, [etapa]: [...currentSelected, item] };
            }
        });
    };

    const irProximaEtapa = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setEtapa(steps[nextIndex]);
        }
    };

    const irEtapaAnterior = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setEtapa(steps[prevIndex]);
        }
    };

    const isNextDisabled = etapa === "Recheio" && selecionados.Recheio.length === 0;

    // Lógica para o botão de finalização/redirecionamento
    const isFinalStep = etapa === steps[steps.length - 1];

    // O botão deve ser um Link ou usar o Router.push na última etapa.
    // Usaremos o Link do Next.js para a etapa final para garantir o redirecionamento.

    return (
        <div className="min-h-screen flex bg-white">

            <div className="flex w-full max-w-7xl mx-auto py-10 px-6">
                
                <div className="w-1/4 pr-10 border-r border-gray-200">
                    
                    <button 
                        onClick={irEtapaAnterior}
                        className="flex items-center text-gray-700 hover:text-gray-900 mb-10"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
                    </button>
                    
                    <p className="text-gray-500 text-sm mb-8">
                       Para o melhor aproveitamento do seu
trabalho selecione todos os itens que
você trabalha, assim você pode
aparecer pra mais clientes! <span className="font-bold text-gray-800">Bolo Perfeito</span>
                    </p>

                    <div className="space-y-4">
                        {steps.map((step) => {
                            const isActive = step === etapa;
                            const isCompleted = steps.indexOf(step) < currentStepIndex;

                            let bgColor = isCompleted ? "bg-purple-200" : "bg-purple-100";
                            let textColor = isCompleted ? "text-white" : "text-gray-500";
                            
                            if (isActive) {
                                bgColor = "bg-purple-400";
                                textColor = "text-white font-semibold";
                            } else if (isCompleted) {
                                bgColor = "bg-purple-300";
                                textColor = "text-white font-semibold";
                            } else {
                                bgColor = "bg-purple-100"; 
                                textColor = "text-gray-600";
                            }
                            
                            return (
                                <button
                                    key={step}
                                    onClick={() => setEtapa(step)}
                                    className={`w-full py-3 rounded-lg text-center transition-colors duration-200 
                                        ${bgColor} ${textColor} text-lg`}
                                    disabled={!isCompleted && !isActive}
                                >
                                    {step}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 pl-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {/* Título dinâmico para a etapa */}
                        Selecione os {etapa.toLowerCase()}s
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {etapa === "Recheio" 
                            ? `Escolha até ${MAX_RECHEIOS} recheios do seu bolo ideal` 
                            : `Escolha os itens desejados para o seu bolo`}
                    </p>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {opcoes[etapa].map((item) => {
                            const isSelected = selecionados[etapa].includes(item);
                            const isDisabled = etapa === "Recheio" && !isSelected && selecionados.Recheio.length >= MAX_RECHEIOS;
                            const itemTextStyle = isDisabled ? 'text-gray-400' : 'text-gray-800';

                            return (
                                <label 
                                    key={item} 
                                    className={`flex items-center space-x-4 text-xl py-2 transition-opacity cursor-pointer ${isDisabled ? 'opacity-50' : 'hover:opacity-80'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelecionado(item)}
                                        disabled={isDisabled}
                                        className="appearance-none w-5 h-5 border border-gray-400 rounded-sm checked:bg-purple-500 checked:border-purple-500 checked:text-white 
                                                   focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-150 relative"
                                        style={{
                                            backgroundImage: isSelected ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none',
                                            backgroundSize: '100% 100%',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundColor: isSelected ? 'rgb(147 51 234)' : 'transparent',
                                            borderColor: isSelected ? 'rgb(147 51 234)' : 'rgb(156 163 175)',
                                        }}
                                    />
                                    <span className={itemTextStyle}>{item}</span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Botão de Próximo / Buscar Confeitarias */}
                    <div className="flex justify-end mt-10">
                        {isFinalStep ? (
                             <Link
                                href={NEXT_PAGE_URL}
                                className="flex items-center justify-center w-full max-w-sm px-6 py-3 rounded-full text-lg transition-all text-white bg-purple-600 hover:bg-purple-700"
                                // O link não deve ser desativado na última etapa; ele sempre avança para a busca
                            >
                                <span className="mr-1">Concluir</span>
                                <ChevronRight className="w-6 h-6" />
                            </Link>
                        ) : (
                            <button
                                onClick={irProximaEtapa}
                                disabled={isNextDisabled}
                                className={`flex items-center justify-center w-full max-w-sm px-6 py-3 rounded-full text-lg transition-all 
                                    ${isNextDisabled 
                                        ? 'bg-purple-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-purple-300 text-white hover:bg-purple-400'
                                    }`}
                                style={{ backgroundColor: isNextDisabled ? '#E0E7FF' : '#C7D2FE', color: isNextDisabled ? '#9CA3AF' : '#6366F1' }}
                            >
                                <span className="mr-1">Avançar</span>
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}