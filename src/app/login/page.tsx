"use client";
import Link from "next/link";
import React, { useState } from "react";
import ROUTES from "../routes"; 
import { auth } from "../../../firebaseconfig"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Header from "../components/headerInicioLoginCadastro";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErro("");
  setCarregando(true);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    const token = await cred.user.getIdToken();

    console.log("✅ Token JWT:", token);
    console.log("👤 UID:", cred.user.uid);

    const resposta = await fetch("https://localhost:7039/api/MockAuth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resposta.ok) {
      throw new Error("Falha na verificação do token no backend.");
    }

    const dados = await resposta.json();
    console.log("🔁 Resposta do backend:", dados);

    router.push("/painel");
  } catch (err) {
    console.error(err);
    setErro("❌ Email ou senha inválidos");
  } finally {
    setCarregando(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
            <Header />


      {/* 🔹 Formulário de login */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-700 hover:text-gray-900">
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

          {erro && <p className="text-center text-red-500 mt-4 text-sm">{erro}</p>}

          <p className="text-center text-gray-400 mt-4 text-sm">
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
