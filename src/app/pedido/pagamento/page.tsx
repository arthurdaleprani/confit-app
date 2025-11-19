import { NextPage } from "next";
import Header from "../../components/header";

const PedidosAguardandoOrcamento: NextPage = () => {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navbar */}
                       <Header />


      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pedidos aguardando orçamento
        </h1>

        {/* Pedidos do Usuário */}
        <div className="space-y-6 mb-8">
          {/* Bolo Perfeito 25463 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Bolo Perfeito 25463</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Massa:</span> Chocolate
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Recheio:</span> Brigadeiro, Geleia de Morango
              </p>
            </div>
          </div>

          {/* Bolo Perfeito 3546 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Bolo Perfeito 3546</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Massa:</span> Chocolate
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Recheio:</span> Brigadeiro, Geleia de Morango
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-8"></div>

        {/* Orçamentos das Confeitarias */}
        <div className="space-y-6">
          {/* Data */}
          <div className="text-center">
            <span className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              22/06/21
            </span>
          </div>

          {/* Adoçare */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Adoçare</h3>
                <p className="text-gray-600 mb-1">5 km de distância</p>
                <div className="flex items-center space-x-4">
                  <span className="text-green-600 font-bold">4.9</span>
                  <span className="text-gray-800 font-bold">R$ 156,90</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-purple-400 text-white rounded-full hover:bg-purple-500 transition-colors">
                Escolher essa confeitaria
              </button>
            </div>
          </div>

          {/* Strawberry Sweet */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Strawberry Sweet</h3>
                <p className="text-gray-600 mb-1">22 km de distância</p>
                <div className="flex items-center space-x-4">
                  <span className="text-green-600 font-bold">4.5</span>
                  <span className="text-orange-500 font-medium">Aguardando orçamento</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-purple-400 text-white rounded-full hover:bg-purple-500 transition-colors">
                Escolher essa confeitaria
              </button>
            </div>
          </div>

          {/* Shauberg Sweet */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Shauberg Sweet</h3>
                <p className="text-gray-600">Coelho de Mouravel</p>
              </div>
              <button className="px-6 py-2 bg-purple-400 text-white rounded-full hover:bg-purple-500 transition-colors">
                Escolher essa confeitaria
              </button>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default PedidosAguardandoOrcamento;