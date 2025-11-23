"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseconfig";
import Header from "../components/headerInicioLoginCadastro";
import ROUTES from "../routes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [tipoConta, setTipoConta] = useState<"" | "cliente" | "confeiteira">("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const token = await cred.user.getIdToken();

      const endpoint =
        tipoConta === "cliente"
          ? `https://confeitaria-production.up.railway.app/api/cliente/buscar/email?Email=${email}`
          : `https://confeitaria-production.up.railway.app/api/confeiteiro/buscar/email?Email=${email}`;

      const resposta = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resposta.ok) throw new Error("Falha na verificação backend");

      const dadosUsuario = await resposta.json();

      localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
      localStorage.setItem("tipoConta", tipoConta);

      console.log("user",dadosUsuario)
      if(tipoConta == "cliente"){
      router.push(ROUTES.INICIAR_PEDIDO);}
      else{
        router.push(ROUTES.AGN_PED_CONF);
      }
    } catch (err) {
      console.error(err);
      setErro("❌ Email ou senha inválidos ou falha no backend");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        {!tipoConta && (
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-md w-full max-w-md gap-4">
            <h1 className="text-xl font-semibold mb-2 text-gray-700">
              Entrar como:
            </h1>

            <button
              onClick={() => setTipoConta("cliente")}
              className="w-64 bg-purple-300 font-bold py-2 rounded-full hover:bg-purple-400"
            >
              Cliente
            </button>

            <button
              onClick={() => setTipoConta("confeiteira")}
              className="w-64 bg-pink-300 font-bold py-2 rounded-full hover:bg-pink-400"
            >
              Confeiteira
            </button>
          </div>
        )}

        {tipoConta && (
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
              Bem-vinda(o)!
            </h1>

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
                required
              />

              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
                required
              />

              <button
                type="submit"
                disabled={carregando}
                className={`bg-purple-200 text-black font-bold rounded-full py-2 transition ${
                  carregando ? "opacity-60 cursor-not-allowed" : "hover:bg-purple-300"
                }`}
              >
                {carregando ? "Entrando..." : "Login"}
              </button>
            </form>

            {erro && (
              <p className="text-center text-red-500 mt-4 text-sm">{erro}</p>
            )}

            <button
              onClick={() => setTipoConta("")}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              ← Voltar para seleção de tipo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
