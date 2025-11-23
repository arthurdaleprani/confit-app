"use client";

import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseconfig";
import Header from "../components/headerInicioLoginCadastro";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROUTES from "../routes";

// Tipos de ingrediente
type TipoIngredienteResponse = {
  id: number;
  nome: string;
  ingrediente: { id: number; nome: string };
};

export default function Register() {
  const [accountType, setAccountType] = useState<"cliente" | "confeitaria">("cliente");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmaSenha: "",
  });

  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const router = useRouter();

  // Step 3: Ingredientes
  const [tiposIngredientes, setTiposIngredientes] = useState<TipoIngredienteResponse[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [selecionadosPorCategoria, setSelecionadosPorCategoria] = useState<Record<string, number[]>>({});
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  // Manipulação de formulários
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndereco({ ...endereco, [name]: value });

    if (name === "cep" && value.length === 8) {
      buscarCep(value);
    }
  };

  async function buscarCep(cep: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEndereco(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Buscar tipos de ingrediente Step 3
  useEffect(() => {
    if (accountType === "confeitaria" && step === 3) {
      const fetchTipos = async () => {
        setLoadingTipos(true);
        try {
          const res = await fetch("https://confeitaria-production.up.railway.app/api/ingrediente/buscar/tipo");
          if (!res.ok) throw new Error("Erro ao buscar tipos de ingrediente");
          const data: TipoIngredienteResponse[] = await res.json();
          setTiposIngredientes(data);

          // Agrupar categorias
          const cats = Array.from(new Set(data.map(t => t.ingrediente.nome)));
          setCategorias(cats);

          // Inicializa selecionados
          const initSelecionados: Record<string, number[]> = {};
          cats.forEach(cat => initSelecionados[cat] = []);
          setSelecionadosPorCategoria(initSelecionados);

        } catch (err: any) {
          setErrorTipos(err.message);
        } finally {
          setLoadingTipos(false);
        }
      };
      fetchTipos();
    }
  }, [accountType, step]);

  const toggleIngredientePorCategoria = (categoria: string, id: number) => {
    setSelecionadosPorCategoria(prev => {
      const atual = prev[categoria];
      if (atual.includes(id)) return { ...prev, [categoria]: atual.filter(x => x !== id) };
      return { ...prev, [categoria]: [...atual, id] };
    });
  };

  async function cadastrarCliente(dados: any) {
    const response = await fetch("https://confeitaria-production.up.railway.app/api/cliente/criar", {
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

  async function cadastrarConfeiteiro(dados: any) {
    const response = await fetch("https://confeitaria-production.up.railway.app/api/confeiteiro/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenPublico"),
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error("Erro ao cadastrar confeiteiro: " + erro);
    }

    return await response.json();
  }

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.senha !== form.confirmaSenha) {
      toast.error("As senhas não conferem!");
      return;
    }

    setLoading(true);

    try {
      // Criar usuário Firebase
      try {
        await createUserWithEmailAndPassword(auth, form.email, form.senha);
      } catch (firebaseError: any) {
        console.error(firebaseError);
        if (firebaseError.code === "auth/email-already-in-use") toast.error("Este e-mail já está cadastrado!");
        else if (firebaseError.code === "auth/invalid-email") toast.error("E-mail inválido!");
        else if (firebaseError.code === "auth/weak-password") toast.error("Senha deve ter pelo menos 6 caracteres!");
        else toast.error("Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }

      if (accountType === "cliente") {
        const payload = {
          nomeCompleto: form.nome,
          cpf: form.cpf,
          email: form.email,
          enderecos: [
            {
              cep: endereco.cep,
              rua: endereco.rua,
              numero: endereco.numero,
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              estado: endereco.estado,
              complemento: endereco.complemento,
              ehPrincipal: true,
            },
          ],
        };
        await cadastrarCliente(payload);
      } else {
        const todosSelecionados = Object.values(selecionadosPorCategoria).flat();
        const payloadConfeiteiro = {
          nomeCompleto: form.nome,
          documento: form.cpf,
          email: form.email,
          endereco: {
            cep: endereco.cep,
            rua: endereco.rua,
            numero: endereco.numero,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            complemento: endereco.complemento,
          },
          codigosTiposIngredientes: todosSelecionados,
        };
        await cadastrarConfeiteiro(payloadConfeiteiro);
      }

      toast.success("Cadastro concluído com sucesso!");
      router.push(ROUTES.LOGIN);

      // Reset
      setForm({ nome: "", email: "", cpf: "", senha: "", confirmaSenha: "" });
      setEndereco({ cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" });
      setSelecionadosPorCategoria({});
      setStep(1);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <aside className="w-1/4 bg-white p-6 flex flex-col space-y-4 border-r border-gray-200">
          <h2 className="text-gray-500">Selecione o tipo de conta:</h2>
          <button onClick={() => setAccountType("cliente")} className={`py-2 rounded-full text-white font-semibold ${accountType === "cliente" ? "bg-purple-400" : "bg-purple-200"}`}>Cliente</button>
          <button onClick={() => setAccountType("confeitaria")} className={`py-2 rounded-full text-white font-semibold ${accountType === "confeitaria" ? "bg-purple-400" : "bg-purple-200"}`}>Confeitaria</button>
        </aside>

        <main className="flex-1 p-8 bg-white">
          <h1 className="text-3xl font-bold text-gray-700 mb-3">
            Cadastro — Etapa {step}{accountType === "confeitaria" ? "/3" : "/2"}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md">

            {/* Step 1 */}
            {step === 1 && (
              <>
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome Completo" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <input name="cpf" value={form.cpf} onChange={handleChange} placeholder={accountType === "confeitaria" ? "CPF/CNPJ" : "CPF"} required />
                <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Senha" required />
                <input type="password" name="confirmaSenha" value={form.confirmaSenha} onChange={handleChange} placeholder="Confirmar Senha" required />
                <button type="button" onClick={() => setStep(2)} className="bg-purple-400 text-white rounded-full py-2 font-bold">Próximo</button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <input name="cep" value={endereco.cep} onChange={handleEnderecoChange} placeholder="CEP" required />
                <input name="rua" value={endereco.rua} onChange={handleEnderecoChange} placeholder="Rua" required />
                <input name="numero" value={endereco.numero} onChange={handleEnderecoChange} placeholder="Número" required />
                <input name="complemento" value={endereco.complemento} onChange={handleEnderecoChange} placeholder="Complemento" />
                <input name="bairro" value={endereco.bairro} onChange={handleEnderecoChange} placeholder="Bairro" required />
                <input name="cidade" value={endereco.cidade} onChange={handleEnderecoChange} placeholder="Cidade" required />
                <input name="estado" value={endereco.estado} onChange={handleEnderecoChange} placeholder="UF" required />

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-300 rounded-full px-4 py-2">Voltar</button>
<button
  type="button"
  onClick={() => {
    if (accountType === "confeitaria") {
      setStep(3);
    } else {
      handleSubmit(new Event("submit") as any); // ou chamar diretamente
    }
  }}
  className="bg-purple-400 text-white rounded-full px-4 py-2 font-bold"
>
  {accountType === "confeitaria" ? "Próximo" : "Finalizar"}
</button>                </div>
              </>
            )}

            {/* Step 3 Ingredientes */}
            {step === 3 && accountType === "confeitaria" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Selecione os ingredientes que você trabalha</h2>
                {loadingTipos && <p>Carregando...</p>}
                {errorTipos && <p className="text-red-500">{errorTipos}</p>}

                {categorias.map(categoria => (
                  <div key={categoria} className="mb-6">
                    <h3 className="font-semibold mb-2">{categoria}</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {tiposIngredientes.filter(t => t.ingrediente.nome === categoria).map(t => (
                        <label key={t.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selecionadosPorCategoria[categoria]?.includes(t.id)}
                            onChange={() => toggleIngredientePorCategoria(categoria, t.id)}
                            className="w-4 h-4"
                          />
                          <span>{t.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-4">
                  <button type="button" onClick={() => setStep(2)} className="bg-gray-300 px-4 py-2 rounded">Voltar</button>
                  <button type="submit" disabled={loading} className="bg-purple-400 text-white px-4 py-2 rounded">Finalizar</button>
                </div>
              </div>
            )}

          </form>
        </main>
      </div>
    </div>
  );
}
