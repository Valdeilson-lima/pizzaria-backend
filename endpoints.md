# Pizzaria API — Guia de Referência de Endpoints para Frontend 🍕

> Documento de referência rápida para integração com o Frontend (Web / Mobile / React / Next.js / React Native).  
> **Base URL:** `http://localhost:3333/api`

---

## 📑 Sumário de Endpoints

| Método   | Endpoint            | Acesso      | Content-Type          | Descrição                                                             |
| :------- | :------------------ | :---------- | :-------------------- | :-------------------------------------------------------------------- |
| `POST`   | `/users`            | **Público** | `application/json`    | Cadastro de novos usuários colaboradores.                             |
| `POST`   | `/session`          | **Público** | `application/json`    | Autenticação (login) e emissão de token JWT.                          |
| `GET`    | `/me`               | **Auth**    | —                     | Retorna os dados do usuário autenticado logado.                       |
| `POST`   | `/category`         | **Admin**   | `application/json`    | Cria uma nova categoria de produtos.                                  |
| `GET`    | `/category`         | **Auth**    | —                     | Lista todas as categorias cadastradas.                                |
| `POST`   | `/product`          | **Admin**   | `multipart/form-data` | Cria um produto com upload de imagem.                                 |
| `GET`    | `/products`         | **Auth**    | —                     | Lista produtos cadastrados (filtro opcional `disabled`).              |
| `DELETE` | `/product`          | **Admin**   | —                     | Desativa um produto do cardápio (`productId`).                        |
| `GET`    | `/category/product` | **Auth**    | —                     | Lista produtos de uma categoria específica (`categoryId`).            |
| `POST`   | `/order`            | **Auth**    | `application/json`    | Abre uma mesa criando uma nova ordem (`table`, `name`).               |
| `GET`    | `/orders`           | **Auth**    | —                     | Lista pedidos com itens (filtro opcional `draft`).                    |
| `POST`   | `/order/add`        | **Auth**    | `application/json`    | Adiciona produto e quantidade a um pedido (`order_id`, `product_id`). |
| `DELETE` | `/order/remove`     | **Auth**    | —                     | Remove um item do pedido (`item_id`).                                 |
| `GET`    | `/order/detail`     | **Auth**    | —                     | Detalha um pedido e seus itens com produtos (`order_id`).             |
| `PUT`    | `/order/send`       | **Auth**    | `application/json`    | Envia pedido para produção na cozinha (`draft: false`).               |
| `PUT`    | `/order/finish`     | **Auth**    | `application/json`    | Finaliza pedido (`status: true`) e libera a mesa.                     |
| `DELETE` | `/order`            | **Auth**    | —                     | Deleta/cancela um pedido (`order_id`), itens e libera a mesa.         |

---

## 🔒 Padrão de Autenticação e Erros

### Headers de Autenticação

Para todas as rotas com nível **Auth** ou **Admin**, inclua o token JWT no cabeçalho HTTP:

```http
Authorization: Bearer <SEU_TOKEN_JWT>
```

### Formato de Erros da API

A API padroniza os erros em duas estruturas:

1. **Erros de Validação de Schema (Zod) — `400 Bad Request`:**

```json
{
  "errors": [
    { "message": "O número da mesa é obrigatório e deve ser um número" }
  ]
}
```

2. **Erros de Regra de Negócio — `400 Bad Request`:**

```json
{
  "error": "Mesa já está ocupada"
}
```

3. **Erros de Autenticação / Autorização — `401 Unauthorized` ou `403 Forbidden`:**

```json
{
  "error": "Token não fornecido"
}
```

```json
{
  "error": "Acesso negado"
}
```

---

## 1. Módulo de Usuários e Autenticação

### 1.1. Cadastrar Usuário (`POST /users`)

- **Nível:** Público
- **Headers:** `Content-Type: application/json`
- **Request Body:**

```json
{
  "name": "João Silva",
  "email": "joao@pizzaria.com",
  "password": "senhaSegura123"
}
```

- **Response `201 Created`:**

```json
{
  "message": {
    "user": {
      "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
      "name": "João Silva",
      "email": "joao@pizzaria.com"
    },
    "message": "Usuario criado com sucesso"
  }
}
```

---

### 1.2. Autenticar / Login (`POST /session`)

- **Nível:** Público
- **Headers:** `Content-Type: application/json`
- **Request Body:**

```json
{
  "email": "joao@pizzaria.com",
  "password": "senhaSegura123"
}
```

- **Response `200 OK`:**

```json
{
  "message": "Usuario autenticado com sucesso",
  "user": {
    "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
    "name": "João Silva",
    "email": "joao@pizzaria.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3. Perfil do Usuário Logado (`GET /me`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response `200 OK`:**

```json
{
  "id": "c1f7b9e0-8fa3-4c90-9b48-1123456789ab",
  "name": "João Silva",
  "email": "joao@pizzaria.com",
  "role": "STAFF",
  "createdAt": "2026-03-15T18:30:00.000Z",
  "updatedAt": "2026-03-15T18:30:00.000Z"
}
```

---

## 2. Módulo de Categorias

### 2.1. Criar Categoria (`POST /category`)

- **Nível:** Autenticado + Admin (`role === "ADMIN"`)
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
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

---

### 2.2. Listar Categorias (`GET /category`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
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

---

## 3. Módulo de Produtos

### 3.1. Criar Produto com Imagem (`POST /product`)

- **Nível:** Autenticado + Admin (`role === "ADMIN"`)
- **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <TOKEN>`
- **FormData Body:**
  - `name`: string (ex: `"Pizza Calabresa"`)
  - `price`: string numérico (ex: `"45"`)
  - `description`: string (ex: `"Molho artesanal, mussarela e calabresa"`)
  - `categoryId`: string UUID da categoria existente
  - `file`: Arquivo de imagem (`.jpg`, `.png`, `.webp`, máx. 4MB)
- **Response `201 Created`:**

```json
{
  "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
  "name": "Pizza Calabresa",
  "price": 45,
  "description": "Molho artesanal, mussarela e calabresa",
  "banner": "https://res.cloudinary.com/.../pizza.webp",
  "category_id": "d8a1c4b2-7fa3-4c90-9b48-998877665544"
}
```

---

### 3.2. Listar Todos os Produtos (`GET /products`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `disabled` _(opcional)_: `"false"` (ativos) ou `"true"` (desativados). Padrão: `"false"`.
- **Exemplos de Chamada:**
  - `GET /products`
  - `GET /products?disabled=true`
- **Response `200 OK`:**

```json
[
  {
    "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
    "name": "Pizza Calabresa",
    "price": 45,
    "description": "Molho artesanal, mussarela e calabresa",
    "banner": "https://res.cloudinary.com/.../pizza.webp",
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

---

### 3.3. Desativar Produto / Soft Delete (`DELETE /product`)

- **Nível:** Autenticado + Admin (`role === "ADMIN"`)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `productId` _(obrigatório)_: UUID do produto a desativar.
- **Exemplo de Chamada:**
  - `DELETE /product?productId=a5d3f1c2-9fa4-4b90-9c48-223344556677`
- **Response `200 OK`:**

```json
{
  "message": "Produto desabilitado com sucesso"
}
```

---

### 3.4. Listar Produtos por Categoria (`GET /category/product`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `categoryId` _(obrigatório)_: UUID da categoria.
- **Exemplo de Chamada:**
  - `GET /category/product?categoryId=d8a1c4b2-7fa3-4c90-9b48-998877665544`
- **Response `200 OK`:**

```json
[
  {
    "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
    "name": "Pizza Calabresa",
    "price": 45,
    "description": "Molho artesanal, mussarela e calabresa",
    "banner": "https://res.cloudinary.com/.../pizza.webp",
    "disabled": false,
    "category_id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
    "createdAt": "2026-03-15T20:00:00.000Z",
    "updatedAt": "2026-03-15T20:00:00.000Z"
  }
]
```

---

## 4. Módulo de Pedidos e Mesas (Fluxo Operacional)

### 4.1. Abrir Mesa / Criar Pedido (`POST /order`)

- **Nível:** Autenticado
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Request Body:**

```json
{
  "table": 12,
  "name": "Mesa da Família Silva"
}
```

> `table` é obrigatório (número inteiro positivo). `name` é opcional.

- **Response `201 Created`:**

```json
{
  "id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "table": 12,
  "name": "Mesa da Família Silva",
  "status": false,
  "draft": true,
  "createdAt": "2026-03-15T20:30:00.000Z",
  "updatedAt": "2026-03-15T20:30:00.000Z"
}
```

- **Erros Comuns:**
  - `400 Bad Request` com `{ "error": "Mesa já está ocupada" }` (se já houver pedido com `status: false` para essa mesa).

---

### 4.2. Listar Pedidos (`GET /orders`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `draft` _(opcional)_: `"false"` (pedidos confirmados na cozinha) ou `"true"` (rascunhos em edição). Padrão: `"false"`.
- **Exemplos de Chamada:**
  - `GET /orders` _(Fila da cozinha)_
  - `GET /orders?draft=true` _(Rascunhos)_
- **Response `200 OK`:**

```json
[
  {
    "id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
    "table": 12,
    "name": "Mesa da Família Silva",
    "status": false,
    "draft": false,
    "createdAt": "2026-03-15T20:30:00.000Z",
    "orderItems": [
      {
        "id": "e8d2b3c1-7fa2-4b80-8a37-001122334455",
        "amount": 2,
        "product": {
          "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
          "name": "Pizza Calabresa",
          "price": 45,
          "description": "Molho artesanal...",
          "banner": "https://...",
          "disabled": false,
          "category": {
            "id": "d8a1c4b2-7fa3-4c90-9b48-998877665544",
            "name": "Pizzas Tradicionais"
          }
        }
      }
    ]
  }
]
```

---

### 4.3. Adicionar Item ao Pedido (`POST /order/add`)

- **Nível:** Autenticado
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Request Body:**

```json
{
  "order_id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "product_id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
  "amount": 2
}
```

- **Response `200 OK`:**

```json
{
  "id": "e8d2b3c1-7fa2-4b80-8a37-001122334455",
  "order_id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "product_id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
  "amount": 2,
  "createdAt": "2026-03-15T20:35:00.000Z",
  "product": {
    "name": "Pizza Calabresa",
    "price": 45
  }
}
```

---

### 4.4. Remover Item do Pedido (`DELETE /order/remove`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `item_id` _(obrigatório)_: UUID do item (`order_items`) a remover.
- **Exemplo de Chamada:**
  - `DELETE /order/remove?item_id=e8d2b3c1-7fa2-4b80-8a37-001122334455`
- **Response `200 OK`:**

```json
{
  "id": "e8d2b3c1-7fa2-4b80-8a37-001122334455",
  "amount": 2,
  "order_id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "product_id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
  "createdAt": "2026-03-15T20:35:00.000Z",
  "updatedAt": "2026-03-15T20:35:00.000Z"
}
```

---

### 4.5. Detalhar Pedido (`GET /order/detail`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `order_id` _(obrigatório)_: UUID do pedido a consultar.
- **Exemplo de Chamada:**
  - `GET /order/detail?order_id=f2a1c4b2-8fa3-4c90-9b48-112233445566`
- **Response `200 OK`:**

```json
{
  "id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "table": 12,
  "name": "Mesa da Família Silva",
  "draft": true,
  "status": false,
  "createdAt": "2026-03-15T20:30:00.000Z",
  "updatedAt": "2026-03-15T20:30:00.000Z",
  "orderItems": [
    {
      "id": "e8d2b3c1-7fa2-4b80-8a37-001122334455",
      "amount": 2,
      "createdAt": "2026-03-15T20:35:00.000Z",
      "updatedAt": "2026-03-15T20:35:00.000Z",
      "product": {
        "id": "a5d3f1c2-9fa4-4b90-9c48-223344556677",
        "name": "Pizza Calabresa",
        "price": 45,
        "description": "Molho artesanal...",
        "banner": "https://..."
      }
    }
  ]
}
```

---

### 4.6. Enviar Pedido para a Cozinha (`PUT /order/send`)

- **Nível:** Autenticado
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Request Body:**

```json
{
  "order_id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "name": "Família Silva"
}
```

> `name` é opcional (atualiza o nome do pedido se informado).

- **Response `200 OK`:**

```json
{
  "id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "table": 12,
  "name": "Família Silva",
  "draft": false,
  "status": false,
  "createdAt": "2026-03-15T20:30:00.000Z"
}
```

---

### 4.7. Finalizar Pedido / Fechar Mesa (`PUT /order/finish`)

- **Nível:** Autenticado
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN>`
- **Request Body:**

```json
{
  "order_id": "f2a1c4b2-8fa3-4c90-9b48-112233445566"
}
```

- **Comportamento:** Altera `status: true`. A mesa fica imediatamente **liberada** para novas ordens.
- **Response `200 OK`:**

```json
{
  "id": "f2a1c4b2-8fa3-4c90-9b48-112233445566",
  "table": 12,
  "name": "Família Silva",
  "draft": false,
  "status": true,
  "createdAt": "2026-03-15T20:30:00.000Z"
}
```

- **Erros Comuns:**
  - `400 Bad Request` com `{ "error": "Este pedido já foi finalizado" }`

---

### 4.8. Deletar / Cancelar Pedido (`DELETE /order`)

- **Nível:** Autenticado
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `order_id` _(obrigatório)_: UUID do pedido a ser removido.
- **Exemplo de Chamada:**
  - `DELETE /order?order_id=f2a1c4b2-8fa3-4c90-9b48-112233445566`
- **Comportamento:** Deleta o pedido, remove todos os itens relacionados em cascata e **libera a mesa**.
- **Response `200 OK`:**

```json
{
  "message": "Pedido deletado com sucesso"
}
```

---

## 💡 Dicas de Integração para Frontend

### 1. Cliente HTTP Recomendado (Axios)

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

// Interceptor para injetar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@pizzaria:token"); // ou cookies / secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Upload de Imagem de Produto (FormData)

```typescript
const formData = new FormData();
formData.append("name", "Pizza Margherita");
formData.append("price", "42");
formData.append("description", "Molho, mussarela e manjericão fresco");
formData.append("categoryId", "categoria-uuid-aqui");
formData.append("file", imageFile); // File do input type="file"

await api.post("/product", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```
