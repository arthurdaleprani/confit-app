"use client";
import React, { useState } from "react";
import Link from "next/link";
import ROUTES from "../routes";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseconfig"; // ✅ importa apenas uma vez
import Header from "../components/headerInicioLoginCadastro";

export default function Register() {
  const [accountType, setAccountType] = useState<"cliente" | "confeitaria">("cliente");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmaSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function cadastrarCliente(dados: any) {
    const response = await fetch("https://localhost:7039/api/User/CadastrarUsuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenPublico"),
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error("Erro ao cadastrar cliente: " + erro);
    }

    return await response.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.senha !== form.confirmaSenha) {
      alert("As senhas não conferem!");
      return;
    }

    if (accountType === "confeitaria") {
      alert("O cadastro de confeitarias será tratado separadamente em outra tela.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Cria o usuário no Firebase (somente cliente)
      await createUserWithEmailAndPassword(auth, form.email, form.senha);

      // ✅ Envia dados básicos para o backend
      const dadosCliente = {
        nomeCompleto: form.nome,
        email: form.email,
        cpf: form.cpf,
      };

      await cadastrarCliente(dadosCliente);

      alert("Cliente cadastrado com sucesso!");
      setForm({ nome: "", email: "", cpf: "", senha: "", confirmaSenha: "" });

    } catch (error: any) {
      console.error(error);
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
            <Header />


      {/* Conteúdo principal */}
      <div className="flex-1 flex">
        {/* Sidebar tipo de conta */}
        <aside className="w-1/4 bg-white p-6 flex flex-col items-start space-y-4 border-r border-gray-200">
          <h2 className="text-gray-500 mb-2">Selecione o tipo de conta:</h2>
          <button
            onClick={() => setAccountType("cliente")}
            className={`w-full py-2 rounded-full text-white font-semibold ${
              accountType === "cliente" ? "bg-purple-400" : "bg-purple-200"
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setAccountType("confeitaria")}
            className={`w-full py-2 rounded-full text-white font-semibold ${
              accountType === "confeitaria" ? "bg-purple-400" : "bg-purple-200"
            }`}
          >
            Confeitaria
          </button>
        </aside>

        {/* Formulário */}
        <main className="flex-1 p-8 bg-white">
          <h1 className="text-3xl font-bold mb-4 text-gray-700 hover:text-gray-900">
            Bem-vinda(o)!
          </h1>
          <p className="text-gray-500 mb-6">
            Ficamos felizes com você entrando para a equipe de{" "}
            {accountType === "cliente" ? "clientes" : "confeitarias"} da Confeitaria Inteligente.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md">
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              type="text"
              placeholder="Nome Completo"
              required
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              required
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              type="text"
              placeholder="CPF"
              required
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              name="senha"
              value={form.senha}
              onChange={handleChange}
              type="password"
              placeholder="Senha"
              required
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />
            <input
              name="confirmaSenha"
              value={form.confirmaSenha}
              onChange={handleChange}
              type="password"
              placeholder="Confirma Senha"
              required
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-900"
            />

            <button
              type="submit"
              disabled={loading}
              className={`bg-purple-400 text-white rounded-full py-2 font-bold hover:bg-purple-500 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
