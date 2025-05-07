import { ParsedQuery } from "../types/Query";

// Campos necessários para a junção entre cliente e pedido
const getRequiredAttributes = (selectFields: string[], joins: ParsedQuery["joins"]): Record<string, Set<string>> => {
  const required: Record<string, Set<string>> = {};

  const add = (table: string, field: string) => {
    if (!required[table]) required[table] = new Set();
    required[table].add(field);
  };

  selectFields.forEach(field => {
    const [table, col] = field.split(".");
    if (table && col) add(table.toLowerCase(), col);
  });

  joins.forEach(join => {
    const matches = join.condition.match(/(\w+)\.(\w+)/g);
    matches?.forEach(m => {
      const [table, col] = m.split(".");
      if (table && col) add(table.toLowerCase(), col);
    });
  });

  return required;
};

export function toRelationalAlgebra(parsed: ParsedQuery): string {
  const requiredAttrs = getRequiredAttributes(parsed.select, parsed.joins);

  // FROM com seleção e projeção mínima
  let base = parsed.from.table;
  if (parsed.from.where || requiredAttrs[base.toLowerCase()]) {
    const projAttrs = requiredAttrs[base.toLowerCase()]
      ? `π ${Array.from(requiredAttrs[base.toLowerCase()]).join(", ")}`
      : "";
    const sel = parsed.from.where
      ? `σ ${parsed.from.where} (${parsed.from.table})`
      : parsed.from.table;

    base = projAttrs ? `${projAttrs} (${sel})` : sel;
  }

  // JOINs com seleção e projeção mínima
  const joinPart = parsed.joins.reduce((acc, join) => {
    let joinTable = join.table;

    const projAttrs = requiredAttrs[join.table.toLowerCase()]
      ? `π ${Array.from(requiredAttrs[join.table.toLowerCase()]).join(", ")}`
      : "";
    const sel = join.where
      ? `σ ${join.where} (${join.table})`
      : join.table;

    joinTable = projAttrs ? `${projAttrs} (${sel})` : sel;

    return `(${acc} ⨝ ${join.condition} ${joinTable})`;
  }, base);

  // WHERE global (restos não aplicados nas tabelas)
  let result = joinPart;
  if (parsed.where) {
    result = `σ ${parsed.where} (${result})`;
  }

  // Projeção final
  if (parsed.select.length) {
    result = `π ${parsed.select.join(", ")} (${result})`;
  }

  return result;
}
