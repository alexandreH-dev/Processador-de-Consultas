# 📘 SQL Query Processor

Este projeto é um **Processador de Consultas SQL com interface gráfica**, desenvolvido para fins didáticos. O sistema permite digitar consultas SQL e visualizá-las convertidas em **Álgebra Relacional**, representando graficamente o plano lógico da consulta.

---

## 💡 Objetivo

Desenvolver uma aplicação web capaz de:

- Interpretar uma consulta SQL simples.
- Realizar o **parsing da consulta** e extrair os componentes principais (`SELECT`, `FROM`, `WHERE`, `JOIN`).
- Converter a consulta para **Álgebra Relacional**.
- Exibir a expressão resultante no navegador.

---

## 🧱 Estrutura do Projeto

```
📆 sql-query-processor
├\2500\2500 src
│   ├\2500\2500 components        # Componentes React (ex: input de consulta)
│   ├\2500\2500 core              # Lógica de parsing e conversão
│   ├\2500\2500 types             # Definições de tipos TypeScript
│   ├\2500\2500 App.tsx           # Componente principal
│   └\2500\2500 main.tsx          # Entry point do React/Vite
├\2500\2500 index.html
├\2500\2500 package.json
├\2500\2500 tsconfig.json
└\2500\2500 vite.config.ts
```

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sql-query-processor.git
cd sql-query-processor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode o projeto

```bash
npm run dev
```

Acesse no navegador: [http://localhost:5173](http://localhost:5173)

---

## 🧾 Exemplos de consultas suportadas

```sql
SELECT Produto.Nome, Categoria.Descricao
FROM Produto
JOIN Categoria ON Produto.Categoria_idCategoria = Categoria.idCategoria
WHERE Produto.Preco > 100
```

---

## 🛠️ Tecnologias utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- Lógica de parsing e álgebra relacional implementadas manualmente

---

## 🤝 Autores

Projeto desenvolvido por [Seu Nome], [Outros integrantes] — como parte da disciplina de Banco de Dados.

