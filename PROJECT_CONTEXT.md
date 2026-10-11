# Pizzaria Backend API — Contexto do Projeto & Documentação Técnica

> **Fonte da Verdade Técnica** para desenvolvedores, arquitetos e agentes de IA que precisarem compreender, manter ou estender a base de código do backend da Pizzaria.

---

## 1. Visão Geral & Stack Tecnológica

### 1.1. Propósito do Sistema

A **Pizzaria Backend API** é uma aplicação RESTful robusta desenvolvida para gerenciar as operações de um estabelecimento de pizzaria. Suas atribuições cobrem o controle de colaboradores com autenticação segura e autorização baseada em papéis (RBAC - _Role-Based Access Control_), estruturação do cardápio (categorias e produtos) e o fluxo operacional de atendimento em salão (abertura de mesas, adição de itens e fechamento de pedidos).

### 1.2. Matriz Tecnológica

| Tecnologia / Pacote      | Versão Exata | Categoria                | Papel Específico no Ecossistema                                                                           |
| :----------------------- | :----------- | :----------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Node.js**              | `>= 20.x`    | Runtime                  | Ambiente de execução JavaScript/TypeScript no servidor.                                                   |
| **TypeScript**           | `^7.0.2`     | Linguagem                | Superset tipado, configurado com verificação estrita (`strict: true`) e resolução de módulos `node16`.    |
| **Express**              | `^5.2.1`     | Framework HTTP           | Servidor HTTP minimalista na versão 5, com tratamento nativo e robusto de rotas assíncronas.              |
| **Prisma ORM**           | `^7.10.0`    | ORM & Migrações          | Mapeamento objeto-relacional de última geração, CLI de migrações e introspecção.                          |
| **@prisma/client**       | `^7.10.0`    | Database Client          | Cliente de queries tipado gerado a partir do schema (`src/generated/prisma`).                             |
| **@prisma/adapter-pg**   | `^7.10.0`    | Driver Adapter           | Adaptador oficial do Prisma 7 para integração direta com conexões nativas do PostgreSQL.                  |
| **pg** (`node-postgres`) | `^8.23.0`    | Database Driver          | Driver de conexão PostgreSQL de alta performance em baixo nível.                                          |
| **Zod**                  | `^4.6.5`     | Validação de Dados       | Validação assíncrona e declaração de contratos de schemas para `body`, `query` e `params`.                |
| **Multer**               | `^2.4.0`     | Upload & Multipart       | Middleware para processamento de requisições `multipart/form-data` e buffer em memória (`memoryStorage`). |
| **Cloudinary**           | `^2.11.0`    | Armazenamento de Mídia   | SDK para upload e hospedagem em nuvem de imagens/banners de produtos via stream.                          |
| **jsonwebtoken**         | `^9.0.3`     | Autenticação             | Emissão e verificação de tokens JWT no padrão stateless (Bearer Token).                                   |
| **bcryptjs**             | `^3.0.3`     | Segurança & Criptografia | Algoritmo de hash unidirecional com salt para armazenamento seguro de senhas.                             |
| **cors**                 | `^2.8.6`     | Segurança de Rede        | Middleware de Cross-Origin Resource Sharing para integração com SPAs e frontends.                         |
| **dotenv**               | `^18.0.0`    | Configuração             | Carregamento automático de variáveis de ambiente a partir do arquivo `.env`.                              |
| **tsx**                  | `^4.23.13`   | Tooling / Dev Server     | Transpilador e executor rápido TypeScript em tempo de desenvolvimento com suporte a watch mode.           |
| **Husky**                | `^9.1.7`     | Git Hooks                | Gerenciador de hooks para execução automatizada de checagens pré-commit e pré-push.                       |
| **lint-staged**          | `^17.6.0`    | Git Hooks                | Execução seletiva de formatadores apenas em arquivos staged no git.                                       |
| **Prettier**             | `^3.9.10`    | Formatação               | Padronização estética consistente de estilo de código.                                                    |
| **Commitlint**           | `^21.2.3`    | Governança Git           | Imposição das convenções do Conventional Commits nas mensagens de commit.                                 |

---

## 2. Arquitetura & Fluxo de Execução

### 2.1. Arquitetura em Camadas (Layered Architecture)

A aplicação adota separação estrita de responsabilidades em camadas desacopladas:

1. **Routes (`src/routes.ts`):** Mapeia os endpoints HTTP no prefixo base `/api` e orquestra a aplicação em pipeline de middlewares (autenticação, autorização e validação de schema).
2. **Middlewares (`src/middlewares/`):** Interceptores que executam inspeções transversais (validação de schemas com Zod, decodificação e validação de token JWT e checagem de permissão RBAC).
3. **Controllers (`src/controllers/`):** Ponto de entrada da camada de transporte HTTP. Desempacotam `body`, `params` e `query`, acionam os Services pertinentes e formatam as respostas com status codes semânticos (`200`, `201`).
4. **Services (`src/services/`):** Concentram a regra de negócio pura e independente de protocolo. Validam unicidade, efetuam hashes de credenciais, lançam exceções de negócio e comunicam-se com a camada de persistência.
5. **Data Access Layer (`src/lib/prisma.ts`):** Instância gerenciada do Prisma Client com driver adapter `@prisma/adapter-pg` sobre PostgreSQL, isolando operações de banco e transações.
6. **Global Error Handler (`src/server.ts`):** Middleware terminal de erro que unifica a resposta HTTP de falhas não tratadas ou exceções lançadas nos Services.

### 2.2. Diagrama do Fluxo de Execução

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP
    participant Express as Servidor Express (/api)
    participant Auth as Middleware Auth / RBAC
    participant Validator as Middleware validateSchema (Zod)
    participant Controller as Controller
    participant Service as Service (Regras de Negócio)
    participant Prisma as Prisma ORM + Postgres
    participant ErrorHandler as Global Error Handler

    Cliente->>Express: Requisição HTTP (POST /api/category)
    Express->>Auth: isAuthenticated & isAdmin
    alt Token ausente ou Role != ADMIN
        Auth-->>Cliente: 401 Unauthorized / 403 Forbidden
    else Autenticado & Autorizado
        Auth->>Validator: Encaminha requisição
    end

    Validator->>Validator: Valida payload com Schema Zod
    alt Falha de Validação
        Validator-->>Cliente: 400 Bad Request { errors: [...] }
    else Payload Válido
        Validator->>Controller: Invoca handle(req, res)
    end

    Controller->>Service: Executa execute({ dados })
    Service->>Prisma: Consulta duplicidade / Persistência
    alt Violação de Regra de Negócio
        Service-->>ErrorHandler: throw new Error("Categoria já existe")
        ErrorHandler-->>Cliente: 400 Bad Request { error: mensagem }
    else Sucesso
        Prisma-->>Service: Registro persistido
        Service-->>Controller: Retorna DTO processado
        Controller-->>Cliente: 201 Created { message, category }
    end
```

### 2.3. Tratamento Global de Erros

A aplicação centraliza o tratamento de erros no pipeline do Express (`src/server.ts`):

- **Erros de Validação (Zod):** O middleware `validateSchema` intercepta `ZodError` e retorna status `400` com a lista detalhada de violações estruturadas:
  ```json
  {
    "errors": [
      { "message": "O nome da categoria precisa ter pelo menos 3 caracteres" }
    ]
  }
  ```
- **Erros de Negócio (`Error` comum):** Lançados nos Services com `throw new Error(...)`, são capturados pelo middleware global gerando status `400`:
  ```json
  {
    "error": "Usuario já existe"
  }
  ```
- **Erros Não Previstos / Infraestrutura:** Retornam fallback seguro com status `500`:
  ```json
  {
    "status": "error",
    "message": "Internal Server Error"
  }
  ```

---

## 3. Estrutura de Diretórios

```text
backend/
├── .agents/                       # Customizações, skills e contextos de agentes de IA
├── .husky/                        # Configurações de ganchos do Git (pre-commit, commit-msg)
├── prisma/
│   ├── migrations/                # Histórico e scripts SQL de versionamento do banco
│   └── schema.prisma              # Definição declarativa dos models, enums e datasources
├── src/
│   ├── @types/                    # Extensões e declarações de tipos globais do TypeScript
│   │   └── express/
│   │       └── index.d.ts         # Injeção de 'user_id' na interface Request do Express
│   ├── config/                    # Constantes de configuração e adapters de terceiros
│   │   ├── cloudinary.ts          # Inicialização e credenciais do SDK do Cloudinary
│   │   └── multer.ts              # Configuração do Multer (memoryStorage, limites e filtros)
│   ├── controllers/               # Controladores HTTP desacoplados por domínio
│   │   ├── category/
│   │   │   ├── createCategoryController.ts  # Tratamento HTTP para criação de categorias
│   │   │   └── listCategoryController.ts    # Tratamento HTTP para listagem de categorias
│   │   ├── product/
│   │   │   ├── createProductController.ts   # Tratamento HTTP para cadastro de produtos com upload
│   │   │   ├── deleteProductController.ts   # Tratamento HTTP para desativação (soft delete) de produto
│   │   │   ├── listByCategoryController.ts  # Tratamento HTTP para listagem de produtos por categoria
│   │   │   └── listProductsController.ts    # Tratamento HTTP para listagem de produtos com filtro
│   │   └── user/
│   │       ├── authUserController.ts        # Login e geração de sessão JWT
│   │       ├── createUserController.ts      # Registro de novos usuários
│   │       └── detailUserController.ts      # Consulta ao perfil do usuário autenticado
│   ├── generated/                 # Artefatos gerados pelo comando 'prisma generate'
│   │   └── prisma/
│   ├── lib/                       # Instâncias compartilhadas e singletons de infraestrutura
│   │   └── prisma.ts              # Configuração do Prisma Client com adapter PostgreSQL
│   ├── middlewares/               # Interceptores de requisição reutilizáveis
│   │   ├── isAdmin.ts             # Middleware de autorização RBAC (perfil ADMIN)
│   │   ├── isAutehtication.ts     # Middleware de verificação e decodificação do JWT
│   │   └── validateSchema.ts      # Middleware genérico de validação assíncrona Zod
│   ├── schemas/                   # Schemas Zod de contrato de entrada (Body, Query, Params)
│   │   ├── createCategorySchema.ts          # Contrato de payload para categoria
│   │   ├── productSchema.ts                 # Contrato de payload para criação de produtos
│   │   └── userSchema.ts                    # Contratos de payload para registro e login
│   ├── services/                  # Lógica de negócio pura e independente de protocolo
│   │   ├── category/
│   │   │   ├── createCategoryService.ts     # Regras de cadastro e unicidade de categorias
│   │   │   └── listCategoryService.ts       # Consulta e ordenação de categorias cadastradas
│   │   ├── product/
│   │   │   ├── createProductService.ts      # Validação de categoria, upload em stream e persistência
│   │   │   ├── deleteProductService.ts      # Desativação de produto (soft delete via disabled = true)
│   │   │   ├── listByCategoryService.ts     # Busca de produtos vinculados a uma categoria específica
│   │   │   └── listProductsService.ts       # Consulta e filtragem de produtos por status (disabled)
│   │   └── user/
│   │       ├── authUserService.ts           # Hash check, validação e assinatura de JWT
│   │       ├── createUserService.ts         # Criação de usuário com hash bcrypt
│   │       └── detailUserService.ts         # Busca de usuário por id com projeção segura
│   ├── routes.ts                  # Registro central de rotas e injeção de middlewares
│   └── server.ts                  # Ponto de entrada (bootstrap), middlewares e listen
├── .commitlintrc.json             # Regras de Conventional Commits para mensagens de commit
├── .env                           # Variáveis de ambiente locais (não comitado)
├── .env.example                   # Template documentado de variáveis necessárias
├── .gitignore                     # Arquivos ignorados pelo controle de versão
├── .lintstagedrc                  # Ações de linting/formatação executadas no pre-commit
├── .prettierrc                    # Configurações de formatação de código
├── package.json                   # Manifesto de dependências e scripts NPM
├── prisma7.config.ts              # Configuração de runtime do Prisma 7 CLI e migrações
└── tsconfig.json                  # Configurações do compilador TypeScript (strict mode)
```

---

## 4. Validação de Dados (Schemas)

A aplicação utiliza o **Zod** para validação em tempo de execução aliada à inferência estática de tipos do TypeScript.

### 4.1. Filosofia de Aplicação

Os schemas são organizados para validar a requisição de forma granular (`body`, `query` e `params`). Eles são aplicados diretamente nas rotas por meio da função de alta ordem `validateSchema(schema: ZodType)`:

```typescript
// src/middlewares/validateSchema.ts
import { ZodError, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err) => ({
          message: err.message,
        }));
        return res.status(400).json({ errors: validationErrors });
      }
      next(error);
    }
  };
```

### 4.2. Exemplos de Implementação de Schemas

#### Registro e Autenticação de Usuários (`src/schemas/userSchema.ts`):

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string("O nome é obrigatório")
      .min(3, { message: "O nome precisa ter pelo menos 3 caracteres" }),
    email: z.email({ message: "O email é inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "O email é inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  }),
});
```

#### Criação de Categorias (`src/schemas/createCategorySchema.ts`):

```typescript
import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string("O nome da categoria é obrigatório")
      .min(3, "O nome da categoria precisa ter pelo menos 3 caracteres"),
  }),
});
```

#### Criação de Produtos (`src/schemas/productSchema.ts`):

```typescript
import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Nome do produto é obrigatório" })
      .min(1, "Nome do produto é obrigatório"),
    price: z
      .string()
      .min(1, "Preço é obrigatório")
      .regex(/^[0-9]+$/, "Preço deve ser numérico"),
    description: z
      .string({ message: "Descrição é obrigatória" })
      .min(1, "Descrição é obrigatória"),
    categoryId: z
      .string({ message: "Categoria é obrigatória" })
      .min(1, "Categoria é obrigatória"),
  }),
});

export const listProductsSchema = z.object({
  query: z
    .object({
      disabled: z
        .enum(["true", "false"], {
          message: "O parâmetro disabled deve ser 'true' ou 'false'",
        })
        .optional(),
    })
    .optional(),
});

export const listByCategorySchema = z.object({
  query: z.object({
    categoryId: z
      .string({ message: "O id da categoria é obrigatório" })
      .min(1, "O id da categoria é obrigatório"),
  }),
});
```

> **Regra Arquitetural para Uploads (`multipart/form-data`):**  
> O middleware `express.json()` não processa requisições multipart. Em rotas que recebem arquivos (como `POST /api/product`), o middleware do Multer (`upload.single(...)`) **deve obrigatoriamente preceder** o `validateSchema(...)` no pipeline do Express. Isso assegura que os campos do formulário sejam lidos da stream e populados no `req.body` antes da execução do parse assíncrono do Zod.

---

## 5. Modelagem do Banco de Dados

A persistência é realizada em **PostgreSQL** através do Prisma ORM (`prisma/schema.prisma`).

### 5.1. Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    users {
        String id PK "UUID"
        String name
        String email UK
        String password "Hash bcrypt"
        Role role "STAFF | ADMIN"
        DateTime createdAt
        DateTime updatedAt
    }

    categories {
        String id PK "UUID"
        String name
        DateTime createdAt
        DateTime updatedAt
    }

    products {
        String id PK "UUID"
        String name
        String description
        Int price "Em centavos"
        String banner "URL/Path da imagem"
        Boolean disabled "Default: false"
        String category_id FK
        DateTime createdAt
        DateTime updatedAt
    }

    orders {
        String id PK "UUID"
        String name "Identificador / Cliente"
        Int table "Número da mesa"
        Boolean status "Finalizado (true/false)"
        Boolean draft "Rascunho aberto (true/false)"
        DateTime createdAt
        DateTime updatedAt
    }

    order_items {
        String id PK "UUID"
        Int amount "Quantidade do item"
        String order_id FK
        String product_id FK
        DateTime createdAt
        DateTime updatedAt
    }

    categories ||--o{ products : "possui (1:N)"
    products ||--o{ order_items : "referenciado em (1:N)"
    orders ||--o{ order_items : "contém (1:N)"
```

### 5.2. DDL SQL Equivalente (PostgreSQL)

```sql
CREATE TYPE "Role" AS ENUM ('STAFF', 'ADMIN');

-- Tabela de Usuários
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de Categorias de Produtos
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de Produtos
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "banner" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de Pedidos
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT,
    "table" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de Itens do Pedido
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "amount" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
```

---

## 6. Especificação de Endpoints (API Reference)

Todas as rotas são expostas a partir do prefixo base: `/api`.

### 6.1. Tabela de Rotas

| Método   | Endpoint                | Nível de Acesso                        | Descrição                                                                        |
| :------- | :---------------------- | :------------------------------------- | :------------------------------------------------------------------------------- |
| `POST`   | `/api/users`            | **Público**                            | Registra um novo colaborador no sistema com perfil `STAFF` por padrão.           |
| `POST`   | `/api/session`          | **Público**                            | Autentica e-mail/senha e emite token JWT com validade de 24h.                    |
| `GET`    | `/api/me`               | **Autenticado** (Bearer JWT)           | Retorna as informações do perfil do usuário autenticado no token.                |
| `POST`   | `/api/category`         | **Autenticado + Admin** (Role `ADMIN`) | Cria uma nova categoria de produtos no cardápio.                                 |
| `GET`    | `/api/category`         | **Autenticado** (Bearer JWT)           | Lista todas as categorias de produtos cadastradas no cardápio.                   |
| `POST`   | `/api/product`          | **Autenticado + Admin** (Role `ADMIN`) | Cadastra um novo produto com upload de imagem via Cloudinary.                    |
| `GET`    | `/api/products`         | **Autenticado** (Bearer JWT)           | Lista todos os produtos com filtro opcional por `disabled` (padrão: `false`).    |
| `DELETE` | `/api/product`          | **Autenticado + Admin** (Role `ADMIN`) | Desativa um produto do cardápio (soft delete via `disabled = true`).             |
| `GET`    | `/api/category/product` | **Autenticado** (Bearer JWT)           | Lista todos os produtos pertencentes a uma categoria informada via `categoryId`. |

---

### 6.2. Documentação Detalhada dos Endpoints

#### 1. Criar Usuário (`POST /api/users`)

- **Autenticação:** Nenhuma (Público).
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@pizzaria.com",
    "password": "senhaSegura123"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "message": {
      "user": {
        "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
        "name": "Maria Silva",
        "email": "maria@pizzaria.com"
      },
      "message": "Usuario criado com sucesso"
    }
  }
  ```
- **Response `400 Bad Request` (Erro de Validação Zod):**
  ```json
  {
    "errors": [
      { "message": "O email é inválido" },
      { "message": "A senha precisa ter pelo menos 6 caracteres" }
    ]
  }
  ```
- **Response `400 Bad Request` (Regra de Negócio - E-mail duplicado):**
  ```json
  {
    "error": "Usuario já existe"
  }
  ```

---

#### 2. Autenticação de Usuário (`POST /api/session`)

- **Autenticação:** Nenhuma (Público).
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "maria@pizzaria.com",
    "password": "senhaSegura123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "message": "Usuario autenticado com sucesso",
    "user": {
      "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
      "name": "Maria Silva",
      "email": "maria@pizzaria.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYzFmN2I5ZTA..."
    }
  }
  ```
- **Response `400 Bad Request` (Credenciais Inválidas):**
  ```json
  {
    "error": "Email ou senha inválidos"
  }
  ```

---

#### 3. Obter Perfil do Usuário Autenticado (`GET /api/me`)

- **Autenticação:** Obrigatória via Header `Authorization: Bearer <TOKEN>`.
- **Response `200 OK`:**
  ```json
  {
    "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
    "name": "Maria Silva",
    "email": "maria@pizzaria.com",
    "role": "STAFF",
    "createdAt": "2026-03-15T18:30:00.000Z",
    "updatedAt": "2026-03-15T18:30:00.000Z"
  }
  ```
- **Response `401 Unauthorized` (Token ausente ou malformatado):**
  ```json
  {
    "error": "Token não fornecido"
  }
  ```
- **Response `401 Unauthorized` (Token expirado ou inválido):**
  ```json
  {
    "error": "Token inválido"
  }
  ```

---

#### 4. Criar Categoria (`POST /api/category`)

- **Autenticação:** Obrigatória via Header `Authorization: Bearer <TOKEN>`.
- **Autorização:** Exige papel `ADMIN` do usuário associado ao token.
- **Request Body:**
  ```json
  {
    "name": "Pizzas Especiais"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "message": "Categoria criada com sucesso",
    "category": {
      "id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
      "name": "Pizzas Especiais",
      "createdAt": "2026-03-15T19:00:00.000Z"
    }
  }
  ```
- **Response `403 Forbidden` (Usuário com perfil STAFF):**
  ```json
  {
    "error": "Acesso negado"
  }
  ```
- **Response `400 Bad Request` (Regra de Negócio - Categoria duplicada):**
  ```json
  {
    "error": "Categoria já existe"
  }
  ```

---

#### 5. Listar Categorias (`GET /api/category`)

- **Nível de Acesso:** Autenticado (qualquer usuário logado com perfil `STAFF` ou `ADMIN`, sem exigência de ser admin).
- **Request Headers:** `Authorization: Bearer <TOKEN>`
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
      "name": "Bebidas",
      "createdAt": "2026-03-15T18:00:00.000Z"
    },
    {
      "id": "e9b2d5c3-8fa4-5d91-0c59-009988776655",
      "name": "Pizzas Especiais",
      "createdAt": "2026-03-15T19:00:00.000Z"
    }
  ]
  ```
- **Response `401 Unauthorized` (Token ausente ou inválido):**
  ```json
  {
    "error": "Token não fornecido"
  }
  ```

---

#### 6. Criar Produto com Upload (`POST /api/product`)

- **Nível de Acesso:** Autenticado + Autorizado (Role `ADMIN`).
- **Request Headers:**
  - `Authorization: Bearer <TOKEN>`
  - `Content-Type: multipart/form-data`
- **Form Data (Multipart Body):**
  - `name`: String (ex: `"Pizza Calabresa"`)
  - `price`: String/Number (ex: `"45"`)
  - `description`: String (ex: `"Molho de tomate artesanal, mussarela fatiada e calabresa"`)
  - `categoryId`: String UUID da categoria existente
  - `file`: Arquivo de imagem (`image/jpeg`, `image/png`, `image/webp` — máx. 4MB)
- **Response `201 Created`:**
  ```json
  {
    "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
    "name": "Pizza Calabresa",
    "price": 45,
    "description": "Molho de tomate artesanal, mussarela fatiada e calabresa",
    "banner": "https://res.cloudinary.com/demo/image/upload/v1712800000/products/1712800000_pizza.webp",
    "category_id": "d8a1c4b2-7fa3-4c90-9b48-998877665544"
  }
  ```
- **Response `400 Bad Request` (Arquivo ausente):**
  ```json
  {
    "error": "Arquivo não fornecido"
  }
  ```
- **Response `400 Bad Request` (Falha de Validação Zod):**
  ```json
  {
    "errors": [
      { "message": "Preço deve ser numérico" },
      { "message": "Categoria é obrigatória" }
    ]
  }
  ```
- **Response `400 Bad Request` (Categoria inexistente):**
  ```json
  {
    "error": "Categoria não encontrada"
  }
  ```
- **Response `403 Forbidden` (Usuário não possui perfil ADMIN):**
  ```json
  {
    "error": "Acesso negado"
  }
  ```

---

#### 7. Listar Produtos (`GET /api/products`)

- **Nível de Acesso:** Autenticado (`Authorization: Bearer <TOKEN>`) — colaboradores com papel `STAFF` ou `ADMIN`.
- **Query Params:**
  - `disabled` _(opcional, string)_: `"false"` para ativos ou `"true"` para inativos/desativados. **Valor padrão se omitido:** `false`.
- **Exemplos de URL:**
  - `/api/products` _(busca produtos ativos: disabled = false)_
  - `/api/products?disabled=false` _(busca produtos ativos: disabled = false)_
  - `/api/products?disabled=true` _(busca produtos desativados: disabled = true)_
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
      "name": "Pizza Calabresa",
      "price": 45,
      "description": "Molho de tomate artesanal, mussarela fatiada e calabresa",
      "banner": "https://res.cloudinary.com/demo/image/upload/v1712800000/products/1712800000_pizza.webp",
      "disabled": false,
      "category_id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
      "category": {
        "id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
        "name": "Pizzas Tradicionais"
      },
      "createdAt": "2026-03-15T20:00:00.000Z",
      "updatedAt": "2026-03-15T20:00:00.000Z"
    }
  ]
  ```
- **Response `400 Bad Request` (Valor inválido no query param):**
  ```json
  {
    "errors": [{ "message": "O parâmetro disabled deve ser 'true' ou 'false'" }]
  }
  ```
- **Response `401 Unauthorized` (Token ausente ou inválido):**
  ```json
  {
    "error": "Token não fornecido"
  }
  ```

---

#### 8. Desativar Produto (`DELETE /api/product`)

- **Nível de Acesso:** Autenticado + Autorizado (Role `ADMIN`).
- **Request Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `productId` _(obrigatório, string UUID)_: Identificador único do produto a ser desabilitado.
- **Exemplo de URL:**
  - `/api/product?productId=a5d3f1c2-9fa4-4b90-9c48-223344556677`
- **Operação:** Soft-delete (altera o campo `disabled` para `true` preservando integridade referencial com pedidos e itens históricos).
- **Response `200 OK`:**
  ```json
  {
    "message": "Produto desabilitado com sucesso"
  }
  ```
- **Response `400 Bad Request` (Parâmetro ausente):**
  ```json
  {
    "error": "Produto não informado"
  }
  ```
- **Response `400 Bad Request` (Produto inexistente):**
  ```json
  {
    "error": "Produto não encontrado"
  }
  ```
- **Response `403 Forbidden` (Usuário não possui perfil ADMIN):**
  ```json
  {
    "error": "Acesso negado"
  }
  ```
- **Response `401 Unauthorized` (Token ausente ou inválido):**
  ```json
  {
    "error": "Token não fornecido"
  }
  ```

---

#### 9. Listar Produtos por Categoria (`GET /api/category/product`)

- **Nível de Acesso:** Autenticado (`Authorization: Bearer <TOKEN>`) — colaboradores com papel `STAFF` ou `ADMIN` (não exige perfil administrativo).
- **Request Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `categoryId` _(obrigatório, string UUID)_: Identificador da categoria cujos produtos serão listados.
- **Exemplo de URL:**
  - `/api/category/product?categoryId=d8a1c4b2-7fa3-4c90-9b48-998877665544`
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
      "name": "Pizza Calabresa",
      "price": 45,
      "description": "Molho de tomate artesanal, mussarela fatiada e calabresa",
      "banner": "https://res.cloudinary.com/demo/image/upload/v1712800000/products/1712800000_pizza.webp",
      "disabled": false,
      "category_id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
      "createdAt": "2026-03-15T20:00:00.000Z",
      "updatedAt": "2026-03-15T20:00:00.000Z"
    }
  ]
  ```
- **Response `400 Bad Request` (Query param ausente):**
  ```json
  {
    "errors": [{ "message": "O id da categoria é obrigatório" }]
  }
  ```
- **Response `401 Unauthorized` (Token ausente ou inválido):**
  ```json
  {
    "error": "Token não fornecido"
  }
  ```

---

## 7. Configuração de Ambiente & Execução

### 7.1. Variáveis de Ambiente (`.env.example`)

Crie um arquivo `.env` na raiz do diretório `backend` espelhando os valores de `.env.example`:

```env
# Porta de escuta do servidor HTTP (padrão: 3333)
PORT=3333

# String de conexão do PostgreSQL (compatível com Prisma 7 + @prisma/adapter-pg)
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/DBPizzaria?schema=public"

# Chave secreta de alta entropia para assinatura dos JWTs
JWT_SECRET="sua_chave_secreta_jwt_longa_e_aleatoria_aqui"

# Configuração do Cloudinary (Upload e Hospedagem de Imagens de Produtos)
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="sua_api_secret"
```

### 7.2. Passo a Passo para Execução Local

#### 1. Instalar dependências

```bash
npm install
```

#### 2. Configurar Git Hooks (Husky)

```bash
npm run prepare
```

#### 3. Gerar os Tipos do Prisma Client

Gera os tipos e cliente customizado para o diretório `src/generated/prisma`:

```bash
npx prisma generate
```

#### 4. Executar Migrações do Banco de Dados

Aplica as migrações no banco de dados configurado no `DATABASE_URL`:

```bash
npx prisma migrate dev
```

#### 5. Iniciar o Servidor em Modo de Desenvolvimento

Inicia a aplicação utilizando `tsx` em modo observador (hot-reload):

```bash
npm run dev
```

O servidor estará disponível e respondendo em: `http://localhost:3333/api`

#### 6. Abrir o Prisma Studio (Opcional)

Para navegar visualmente pelos dados das tabelas:

```bash
npx prisma studio
```

---

## 8. Diretrizes de Qualidade e Boas Práticas

- **Convenção de Commits:** O projeto utiliza `@commitlint/config-conventional`. Todas as mensagens de commit devem seguir o padrão:
  `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
- **Pre-commit Hooks:** O `lint-staged` roda automaticamente o `prettier --write` nos arquivos modificados antes de confirmar o commit.
- **Tipagem Estrita:** O compilador TypeScript está configurado com `strict: true`, `noImplicitAny: true` e `noUnusedLocals: true`. Evite o uso de `any` explícito ou implícito em novas contribuições.
- **Arquitetura Desacoplada:** Ao implementar novos recursos (ex: produtos e pedidos), mantenha a convenção estabelecida: Schema Zod -> Controller -> Service -> Prisma.
