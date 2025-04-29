import { ParsedQuery } from "../types/Query";

export function optimizeQuery(parsed: ParsedQuery): ParsedQuery {
  const optimized: ParsedQuery = {
    select: parsed.select,
    from: parsed.from,
    joins: parsed.joins,
    where: parsed.where,
  };

  // Heurística 1: Mover seleção para mais perto das tabelas (simulado)
  // Separar condições da cláusula WHERE para associar com JOINs
  if (parsed.where) {
    const conditions = parsed.where.split(/\s+and\s+/i).map(c => c.trim());

    // Reordena condições para vir primeiro as que referenciam tabelas isoladas (simples)
    const selectionFirst = conditions.sort((a, b) => {
      const aTables = (a.match(/\./g) || []).length;
      const bTables = (b.match(/\./g) || []).length;
      return aTables - bTables; // ex: Produto.Preco > 100 antes de Produto.id = Cliente.id
    });

    optimized.where = selectionFirst.join(" AND ");
  }

  // Heurística 2: aplicar projeção o quanto antes
  // (neste modelo simplificado, não alteramos estrutura, só mantemos projeção)
  // Em versões mais completas, isso alteraria o grafo diretamente.

  return optimized;
}
