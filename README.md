# Projeto Confeitaria - Front-End

## Estrutura de Pastas e Arquivos

### `src/components`
Contém componentes reutilizáveis da interface.

- **ui**: Componentes de interface genéricos, como `Button`, `Dialog`, `Input` e `Label`.
- **Headers e Footer**: Diferentes headers para:
  - Confeiteiro
  - Cliente
  - Páginas iniciais  
  Além disso, contém o `Footer` e modelo de `Alerts`.
- **login**: Página de login.
- **cadastro**: Página de cadastro de usuários.
- **pedido**: Todas as páginas relacionadas a pedidos.

---

## Rotas

As rotas da aplicação estão definidas em `Routes.ts`:

| Nome                  | Caminho                          |
|-----------------------|---------------------------------|
| HOME                  | `/`                             |
| LOGIN                 | `/login`                        |
| CADASTRO              | `/cadastro`                     |
| INICIAR_PEDIDO        | `/pedido/iniciarPedido`         |
| FAZER_PEDIDO          | `/pedido/pedidoCliente`         |
| INGR_CONFEI           | `/pedido/ingredientesConfeiteira` |
| AGN_PED_CONF           | `/pedido/agendaPedidosConfeiteira` |
| AGN_APROV             | `/pedido/pedenteAprovarConfeiteira` |
| HIST_CLIENTE          | `/pedido/historicoCliente`      |
| ORCAMENTO             | `/pedido/solicitarOrcamento`   |
| PAGAMENTO             | `/pedido/pagamento`             |

---

## `public`
Contém arquivos públicos, como imagens e ícones SVG:

- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

---

## Configurações

- `firebaseconfig.ts`: Configuração do Firebase.
- `next.config.ts`: Configuração do Next.js.
- `postcss.config.mjs`: Configuração do PostCSS.
- `tsconfig.json`: Configuração do TypeScript.

---

## Dependências

- `node_modules`: Pacotes do Node.js.
- `package.json` / `package-lock.json`: Gerenciamento de dependências.

## .env
Tem um arquivo .env obviamente não foi commitado e está no gitignore, porem ele é essencial para rodar localmente.
Todas a variveis la estão nas variaveis de ambiente do github.

# Paleta de Cores
<img width="761" height="525" alt="image" src="https://github.com/user-attachments/assets/c77da6c9-4723-4467-b80e-64a835dd70ca" />

# Link FIGMA: https://www.figma.com/design/j9bksmIQ8WwRSQzCtjGPVa/Confeitaria?node-id=0-1&p=f





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
