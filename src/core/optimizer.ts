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
      if (/cliente\./i.test(cond)) {
        optimized.from.where = optimized.from.where
          ? `${optimized.from.where} AND ${cond}`
          : cond;
      } else {
        // Tenta encontrar o JOIN certo para associar
        const matchingJoin = optimized.joins.find(j =>
          new RegExp(`${j.table}\\.`, "i").test(cond)
        );

        if (matchingJoin) {
          matchingJoin.where = matchingJoin.where
            ? `${matchingJoin.where} AND ${cond}`
            : cond;
        } else {
          remainingConditions.push(cond);
        }
      }
    }

    // As que não se encaixaram continuam na WHERE global
    optimized.where = remainingConditions.join(" AND ");
  }

  // Heurística 2: reordenar JOINs baseado nas condições
  if (optimized.joins.length && parsed.where) {
    const whereConds = parsed.where.toLowerCase();

    optimized.joins = optimized.joins.sort((a, b) => {
      const aScore = (whereConds.match(new RegExp(`${a.table}\\.`,"g")) || []).length;
      const bScore = (whereConds.match(new RegExp(`${b.table}\\.`,"g")) || []).length;
      return bScore - aScore;
    });
  }

  return optimized;
}
