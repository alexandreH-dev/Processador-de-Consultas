export const metadata: { [key: string]: string[] } = {
  Categoria: ["idCategoria", "Descricao"],
  Produto: ["idProduto", "Nome", "Descricao", "Preco", "QuantEstoque", "Categoria_idCategoria"],
  // ... adiciona as outras tabelas
};

export const isValidTable = (table: string) => table in metadata;
export const isValidField = (table: string, field: string) =>
  isValidTable(table) && metadata[table].includes(field);
