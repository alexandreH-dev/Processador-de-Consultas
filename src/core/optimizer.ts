import { ParsedQuery } from "../types/Query";

export function optimizeQuery(parsed: ParsedQuery): ParsedQuery {
  const from = typeof parsed.from === "string" ? { table: parsed.from } : parsed.from;

  const optimized: ParsedQuery = {
    select: parsed.select,
    from,
    joins: parsed.joins.map(j => ({ ...j })),
    where: "",
  };

  if (parsed.where) {
    const conditions = parsed.where.split(/\s+and\s+/i).map(c => c.trim());
    const remainingConditions: string[] = [];

    for (const cond of conditions) {
      // ✅ Se a condição é do FROM principal (ex: Produto.Preco > 100)
      if (new RegExp(`^${from.table}\\.`, "i").test(cond)) {
        optimized.from.where = optimized.from.where
          ? `${optimized.from.where} AND ${cond}`
          : cond;

      // ✅ Se a condição está associada a alguma tabela de JOIN
      } else {
        const matchingJoin = optimized.joins.find(j =>
          new RegExp(`^${j.table}\\.`, "i").test(cond)
        );

        if (matchingJoin) {
          matchingJoin.where = matchingJoin.where
            ? `${matchingJoin.where} AND ${cond}`
            : cond;
        } else {
          // ❗ Condições globais (sem tabela clara) ficam na seleção global
          remainingConditions.push(cond);
        }
      }
    }

    // Se restaram condições que não foram associadas a FROM ou JOINs, mantêm-se como seleção global
    optimized.where = remainingConditions.join(" AND ");
  }

  // ✅ Heurística: ordenar JOINs com base no número de ocorrências no WHERE
  if (optimized.joins.length && parsed.where) {
    const whereConds = parsed.where.toLowerCase();

    optimized.joins = optimized.joins.sort((a, b) => {
      const aScore = (whereConds.match(new RegExp(`${a.table.toLowerCase()}\\.`, "g")) || []).length;
      const bScore = (whereConds.match(new RegExp(`${b.table.toLowerCase()}\\.`, "g")) || []).length;
      return bScore - aScore;
    });
  }

  return optimized;
}
