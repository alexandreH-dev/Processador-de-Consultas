export const metadata: { [key: string]: string[] } = {
  Categoria: ["idCategoria", "Descricao"],
  Produto: ["idProduto", "Nome", "Descricao", "Preco", "QuantEstoque", "Categoria_idCategoria"],
  TipoCliente: ["idTipoCliente", "Descricao"],
  Cliente: ["idCliente", "Nome", "Email", "Nascimento", "Senha", "TipoCliente_idTipoCliente", "DataRegistro"],
  TipoEndereco: ["idTipoEndereco", "Descricao"],
  Endereco: ["idEndereco", "EnderecoPadrao", "Logradouro", "Numero", "Complemento", "Bairro", "Cidade",
    "UF", "CEP", "TipoEndereco_idTipoEndereco", "Cliente_idCliente"],
  Telefone: ["Numero", "Cliente_idCliente"],
  Status: ["idStatus", "Descricao"],
  Pedido: ["idPedido", "Status_idStatus", "DataPedido", "ValorTotalPedido", "Cliente_idCliente"],
  Pedido_has_Produto: ["idPedidoProduto", "Pedido_idPedido", "Produto_idProduto", "Quantidade",
    "PrecoUnitario"],
};

export const isValidTable = (table: string) => table in metadata;
export const isValidField = (table: string, field: string) =>
  isValidTable(table) && metadata[table].includes(field);
