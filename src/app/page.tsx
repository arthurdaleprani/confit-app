import { NextPage } from "next";
import ROUTES from "../app/routes"; 
import Link from "next/link";
import Header from "./components/headerInicioLoginCadastro";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navbar */}
        <Header />


      {/* Hero Section */}
<header className="text-center py-32 bg-purple-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          O bolo perfeito, a sua encomenda dos sonhos sendo possível
        </h1>
        <p className="text-gray-600 mb-6">
          Monte seu pedido ideal e te interligaremos com confeitarias de acordo com o seus desejos
        </p>
        <button className="px-6 py-3 bg-purple-400 text-white rounded-full hover:bg-purple-500">
          Monte o seu bolo
        </button>
      </header>
<div>.</div>

      {/* Objetivo da plataforma */}
      <section className="px-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-purple-600 mb-4">
          O objetivo da Confeitaria Inteligente:
        </h2>
        <p className="text-gray-700 mb-6">
          Nosso objetivo como produto é poder interligar micro e pequenas confeitarias com seu consumidor final...
        </p>

        <h3 className="text-lg font-bold text-gray-900 mb-2">Serviços Ofertados:</h3>
        <p className="text-gray-700">
          A plataforma oferece a possibilidade de centralizar todas as encomendas em uma única aplicação...
        </p>
      </section>
    </div>
  );
};

export default Home;
