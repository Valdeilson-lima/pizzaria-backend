# Pizzaria Backend API 🍕

API RESTful para gestão operacional de pizzaria desenvolvida com **Node.js**, **TypeScript**, **Express 5**, **Prisma 7** e **PostgreSQL**.

> 📖 **Documentação Técnica Completa e Fonte da Verdade Arquitetural:**  
> Consulte o arquivo [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) para detalhes completos de arquitetura, diagramas de fluxo, schemas Zod, modelagem do banco e especificação de endpoints.

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

Copie o arquivo de exemplo e configure suas credenciais:

```bash
cp .env.example .env
```

### 4. Banco de Dados e Migrações

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Executar em Desenvolvimento

```bash
npm run dev
```

A API estará rodando em `http://localhost:3333/api`.
