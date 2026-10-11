# Pizzaria Backend API 🍕

API RESTful para gestão operacional de pizzaria desenvolvida com **Node.js**, **TypeScript**, **Express 5**, **Prisma 7** e **PostgreSQL**.

> 📖 **Documentação Técnica Completa e Fonte da Verdade Arquitetural:**  
> Consulte o arquivo [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) para detalhes completos de arquitetura em camadas, diagramas de fluxo de execução, schemas de validação Zod, modelagem relacional do banco de dados e contratos de payloads da API.

---

## 🛠️ Tecnologias Principais

- **Runtime & Linguagem:** [Node.js](https://nodejs.org/) (v20+) com [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [Express 5](https://expressjs.com/)
- **ORM & Banco de Dados:** [Prisma ORM 7](https://www.prisma.io/) com `@prisma/adapter-pg` sobre [PostgreSQL](https://www.postgresql.org/)
- **Validação de Schemas:** [Zod](https://zod.dev/)
- **Upload & Armazenamento de Mídia:** [Multer](https://github.com/expressjs/multer) (buffer em memória) e [Cloudinary](https://cloudinary.com/) (CDN / Cloud storage)
- **Autenticação & Criptografia:** [JSON Web Token (JWT)](https://jwt.io/) e [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Qualidade de Código & Git Hooks:** [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged), [Prettier](https://prettier.io/) e [Commitlint](https://commitlint.js.org/)

---

## 🛣️ Rotas Disponíveis (Base: `/api`)

| Método   | Endpoint                | Nível de Acesso                        | Descrição                                                             |
| :------- | :---------------------- | :------------------------------------- | :-------------------------------------------------------------------- |
| `POST`   | `/api/users`            | **Público**                            | Cadastro de novo usuário/colaborador (perfil `STAFF` padrão).         |
| `POST`   | `/api/session`          | **Público**                            | Login de usuário com e-mail/senha e geração de token JWT.             |
| `GET`    | `/api/me`               | **Autenticado** (Bearer JWT)           | Retorna as informações do usuário autenticado.                        |
| `POST`   | `/api/category`         | **Autenticado + Admin** (Role `ADMIN`) | Cadastra uma nova categoria no cardápio.                              |
| `GET`    | `/api/category`         | **Autenticado** (Bearer JWT)           | Lista todas as categorias cadastradas ordenadas por nome.             |
| `POST`   | `/api/product`          | **Autenticado + Admin** (Role `ADMIN`) | Cadastra um novo produto com upload de imagem via Cloudinary.         |
| `GET`    | `/api/products`         | **Autenticado** (Bearer JWT)           | Lista todos os produtos com filtro por `disabled` (padrão: `false`).  |
| `DELETE` | `/api/product`          | **Autenticado + Admin** (Role `ADMIN`) | Desativa um produto do cardápio (soft delete via `disabled = true`).  |
| `GET`    | `/api/category/product` | **Autenticado** (Bearer JWT)           | Lista todos os produtos pertencentes a uma categoria (`categoryId`).  |
| `POST`   | `/api/order`            | **Autenticado** (Bearer JWT)           | Abre um novo pedido para uma mesa (`status: false`, `draft: true`).   |
| `GET`    | `/api/orders`           | **Autenticado** (Bearer JWT)           | Lista pedidos com itens e produtos (filtro `draft`, padrão: `false`). |

---

## 🚀 Quick Start

### 1. Pré-requisitos

- **Node.js** >= 20.x
- **PostgreSQL** 16+

### 2. Instalação

```bash
git clone <url-do-repositorio>
cd backend
npm install
npm run prepare
```

### 3. Configuração de Variáveis de Ambiente

Copie o modelo de ambiente e preencha suas credenciais:

```bash
cp .env.example .env
```

Exemplo das variáveis:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/DBPizzaria?schema=public"
JWT_SECRET="sua_chave_secreta_jwt_longa_e_segura"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="sua_api_secret"
```

### 4. Banco de Dados e Migrações

```bash
# Gerar os clientes tipados do Prisma
npx prisma generate

# Executar as migrações do banco de dados
npx prisma migrate dev
```

### 5. Executar em Desenvolvimento

```bash
npm run dev
```

A API estará rodando em: `http://localhost:3333/api`

### 6. Ferramentas Adicionais

Para inspecionar visualmente o banco de dados via navegador:

```bash
npx prisma studio
```

---

## 📐 Padrões de Commit & Governança

O projeto utiliza **Conventional Commits** e ganchos de pré-commit com Husky e lint-staged:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações em documentação
- `refactor:` Refatoração de código sem mudança de comportamento
- `chore:` Tarefas de manutenção ou dependências
