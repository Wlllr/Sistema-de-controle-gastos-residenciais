# 💰 Sistema de Controle de Gastos Residenciais

Uma aplicação completa para **gerenciamento de despesas e receitas residenciais por pessoa**.

O projeto é composto por uma **API REST** desenvolvida em **.NET 8**, seguindo uma arquitetura em camadas (**Repository Pattern + Service Layer**), com **testes automatizados** utilizando **xUnit**, **Moq** e **FluentAssertions**, além de uma interface moderna construída em **React + Vite**.

---

# 🚀 Tecnologias Utilizadas

## Backend (`ControleGastos.API`)

* .NET 8 / C#
* Entity Framework Core 8
* SQLite
* Swagger / OpenAPI

## Testes (`ControleGastos.Tests`)

* xUnit
* Moq
* FluentAssertions

## Frontend (`controle-gastos-web`)

* React
* Vite
* TypeScript / JavaScript
* Axios

---

# 🏗️ Arquitetura do Backend

O backend foi desenvolvido seguindo os princípios de **Responsabilidade Única (SRP)** e **Separation of Concerns**, organizando cada responsabilidade em uma camada específica.

```text
ControleGastos.API/
│
├── Controllers/      # Endpoints e códigos HTTP
├── Services/         # Regras de negócio
├── Repositories/     # Acesso ao banco de dados
├── Models/           # Entidades do domínio
├── DTOs/             # Objetos de transferência de dados
├── Data/             # AppDbContext (Entity Framework)
└── Program.cs
```

### Fluxo da aplicação

```text
Cliente
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Entity Framework Core
   │
   ▼
SQLite
```

---

# ⚙️ Regras de Negócio

## 👶 Validação de menor de idade

Pessoas com **menos de 18 anos** podem cadastrar **apenas despesas**.

Caso uma tentativa de cadastro de **Receita** seja realizada para um menor de idade, a operação será bloqueada pela camada de serviço (`TransacaoService`).

---

## 🗑️ Exclusão em cascata

Ao excluir uma pessoa, todas as transações vinculadas a ela são removidas automaticamente.

---

## 📊 Relatório Financeiro

O sistema calcula automaticamente:

* Total de receitas por pessoa
* Total de despesas por pessoa
* Saldo individual
* Total geral de receitas
* Total geral de despesas
* Saldo consolidado

---

# 🧪 Testes Automatizados

O projeto possui testes unitários cobrindo as principais regras de negócio, incluindo:

* Validação para menores de idade
* Cálculo dos totais do relatório
* Regras da camada de serviço

### Executando os testes

```bash
dotnet test
```

### Executando com relatório detalhado

```bash
dotnet test --logger "console;verbosity=detailed"
```

---

# 📦 Executando o Projeto

## Pré-requisitos

* .NET 8 SDK
* Node.js 18+

---

## 1️⃣ Executando a API

Entre na pasta da API:

```bash
cd ControleGastos.API
```

Execute o projeto:

```bash
dotnet run
```

A API ficará disponível em:

```text
https://localhost:7000
```

ou

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/swagger
```

---

## 2️⃣ Executando o Frontend

Em outro terminal:

```bash
cd controle-gastos-web
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O Vite exibirá o endereço da aplicação (geralmente):

```text
http://localhost:5173
```

---

# 📌 Endpoints da API

## Pessoas

| Método | Endpoint            | Descrição                           |
| ------ | ------------------- | ----------------------------------- |
| GET    | `/api/pessoas`      | Lista todas as pessoas              |
| POST   | `/api/pessoas`      | Cadastra uma pessoa                 |
| DELETE | `/api/pessoas/{id}` | Remove uma pessoa e suas transações |

---

## Transações

| Método | Endpoint          | Descrição                 |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/transacoes` | Lista todas as transações |
| POST   | `/api/transacoes` | Cadastra uma transação    |

---

## Relatórios

| Método | Endpoint      | Descrição                                      |
| ------ | ------------- | ---------------------------------------------- |
| GET    | `/api/totais` | Retorna receitas, despesas e saldo consolidado |

---

# 📁 Estrutura do Projeto

```text
ControleGastos/
│
├── ControleGastos.API/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   └── Program.cs
│
├── ControleGastos.Tests/
│
└── controle-gastos-web/
```

---

# 📸 Funcionalidades

* ✅ Cadastro de pessoas
* ✅ Cadastro de receitas
* ✅ Cadastro de despesas
* ✅ Validação de menor de idade
* ✅ Exclusão em cascata
* ✅ Relatório financeiro
* ✅ API documentada com Swagger
* ✅ Testes unitários
* ✅ Interface React

---

# 💡 Git / Pull Request

Para enviar as alterações para o repositório remoto:

```bash
git add .

git commit -m "docs: adiciona README detalhado"

git push origin feature/refatoracao-separacaCamadas
```

---

# 📄 Licença

Este projeto foi desenvolvido para fins de estudo e demonstração de boas práticas de desenvolvimento utilizando **.NET 8**, **React**, **Entity Framework Core** e **Testes Unitários**.
