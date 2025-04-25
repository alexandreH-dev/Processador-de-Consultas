import { ParsedQuery } from "../types/Query";

export function parseSQL(query: string): ParsedQuery {
  // Normaliza query para evitar problemas de maiúsculas/minúsculas
  const cleanedQuery = query.replace(/\s+/g, " ").trim();

  // Extrair partes principais usando regex
  const selectMatch = cleanedQuery.match(/select (.+?) from/i);
  const fromMatch = cleanedQuery.match(/from (.+?)( where| join|$)/i);
  const whereMatch = cleanedQuery.match(/where (.+?)( join|$)/i);
  const joinMatches = [...cleanedQuery.matchAll(/join (.+?) on (.+?)( where| join|$)/gi)];

  if (!selectMatch || !fromMatch) {
    throw new Error("Consulta inválida: precisa ter SELECT e FROM.");
  }

  const selectFields = selectMatch[1].split(",").map(s => s.trim());

  if (selectFields.includes("*")) {
    throw new Error("Erro: uso de '*' no SELECT não é permitido.");
  }

  const joins = joinMatches.map(m => ({
    table: m[1].trim(),
    condition: m[2].trim()
  }));

  return {
    select: selectFields,
    from: fromMatch[1].trim(),
    where: whereMatch?.[1]?.trim(),
    joins,
  };
}
