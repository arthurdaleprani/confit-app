"use client";

import Link from "next/link";
import { User } from "lucide-react";
import ROUTES from "../routes";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { auth } from "../../../firebaseconfig";
import { useRouter } from "next/navigation";

interface Endereco {
  id: number;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento: string;
  ehPrincipal: string;
}

interface UserStorage {
  id: number;
  nomeCompleto: string;
  enderecos: Endereco[];
  enderecoPrincipal?: Endereco;
}

export default function Header() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("Vitória");
  const [uf, setUf] = useState("ES");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const [loadingCep, setLoadingCep] = useState(false);
  const [userName, setUserName] = useState("User");

  // Carregar usuário do localStorage
  useEffect(() => {
    const userStorage = localStorage.getItem("usuario");

    if (userStorage) {
      const user: UserStorage = JSON.parse(userStorage);
      setUserName(user.nomeCompleto);

      if (user.enderecos) setEnderecos(user.enderecos);
      if (user.enderecoPrincipal) {
        setCidade(user.enderecoPrincipal.cidade);
        setUf(user.enderecoPrincipal.estado);
      }
    }
  }, []);

  // Consultar CEP via API ViaCEP
  async function consultarCEP(valor: string) {
    if (valor.length !== 8) return;

    setLoadingCep(true);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        toast.error("CEP inválido!");
        setLoadingCep(false);
        return;
      }

      setRua(dados.logradouro || "");
      setBairro(dados.bairro || "");
      setCidade(dados.localidade || "");
      setUf(dados.uf || "");
    } catch {
      toast.error("Erro ao consultar CEP");
    } finally {
      setLoadingCep(false);
    }
  }

  // Salvar novo endereço
  async function salvarEndereco(e: React.FormEvent) {
    e.preventDefault();

    const userStorage = localStorage.getItem("usuario");
    if (!userStorage) {
      toast.error("Usuário não encontrado");
      return;
    }
    const user = JSON.parse(userStorage);

    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    const body = {
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado: uf,
      complemento,
      id_Cliente: user.id,
    };

    try {
      const response = await fetch("https://confeitaria-production.up.railway.app/api/endereco/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error();

      toast.success("Endereço salvo!");
      setOpen(false);
    } catch {
      toast.error("Erro ao salvar");
    }
  }

  // Selecionar endereço principal
  async function selecionarEndereco(id: number) {
    const userStorage = localStorage.getItem("usuario");
    if (!userStorage) {
      toast.error("Usuário não encontrado");
      return;
    }
    const user = JSON.parse(userStorage);

    try {
      const body = { codigoCliente: user.id, codigoEndereco: id };
      const response = await fetch(
        "https://confeitaria-production.up.railway.app/api/cliente/alterar/endereco-principal",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error();

      const result = await response.json();
      localStorage.setItem("usuario", JSON.stringify(result));

      setCidade(result.enderecoPrincipal.cidade);
      setUf(result.enderecoPrincipal.estado);
      setEnderecos(result.enderecos);

      toast.success("Endereço principal atualizado!");
      setOpen(false);
    } catch {
      toast.error("Erro ao alterar endereço principal");
    }
  }

  // Logout
  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("usuario");
      toast.success("Logout realizado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao sair");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        {/* Links principais */}
        <div className="flex space-x-8 text-sm font-light">
          <Link href={ROUTES.HIST_CLIENTE} className="text-gray-700 hover:text-purple-600 transition">
            Histórico
          </Link>
          <Link href={ROUTES.PAGAMENTO} className="text-gray-700 hover:text-purple-600 transition">
            À pagar
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">
            Fale Conosco
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded-full border-2 border-purple-300"></div>
          <span className="font-bold text-gray-900">ConfIT</span>
        </div>

        {/* Usuário e endereços */}
        <div className="flex items-center space-x-8 text-sm font-light">
          {/* Dialog de endereços */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="text-gray-700 hover:text-purple-600 transition">
                {cidade} - {uf}
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-lg rounded-xl shadow-2xl border-0 p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-purple-700">
                  Endereços
                </DialogTitle>
              </DialogHeader>

              {enderecos.length > 0 && (
                <div className="mt-4 mb-6 space-y-2 border p-3 rounded bg-gray-50">
                  {enderecos.map(e => (
                    <button
                      key={e.id}
                      className="w-full border p-2 rounded-lg hover:bg-purple-100 text-left transition"
                      onClick={() => selecionarEndereco(e.id)}
                    >
                      {e.rua}, {e.numero} — {e.bairro}
                    </button>
                  ))}
                </div>
              )}

              <form className="space-y-4 mt-6" onSubmit={salvarEndereco}>
                <div>
                  <label>CEP</label>
                  <input
                    className="border rounded p-2 w-full"
                    value={cep}
                    onChange={e => {
                      setCep(e.target.value);
                      consultarCEP(e.target.value);
                    }}
                  />
                  {loadingCep && (
                    <p className="text-xs text-gray-500 mt-1">Consultando...</p>
                  )}
                </div>
                <div>
                  <label>Rua</label>
                  <input
                    className="border rounded p-2 w-full"
                    value={rua}
                    onChange={e => setRua(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label>Número</label>
                    <input
                      className="border rounded p-2 w-full"
                      value={numero}
                      onChange={e => setNumero(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label>Bairro</label>
                    <input
                      className="border rounded p-2 w-full"
                      value={bairro}
                      onChange={e => setBairro(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label>Cidade</label>
                    <input
                      className="border rounded p-2 w-full"
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <label>UF</label>
                    <input
                      className="border rounded p-2 w-full"
                      value={uf}
                      onChange={e => setUf(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label>Complemento</label>
                  <input
                    className="border rounded p-2 w-full"
                    value={complemento}
                    onChange={e => setComplemento(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Salvar novo endereço
                </button>
              </form>
            </DialogContent>
          </Dialog>

          <Link href={ROUTES.INICIAR_PEDIDO} className="text-gray-700 hover:text-purple-600 transition">
            Fazer pedido
          </Link>

          {/* Usuário + Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-700">
              <User className="h-5 w-5 text-purple-600 opacity-70" />
              <span className="font-light">{userName}</span>
            </div>
            <button
              onClick={logout}
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
