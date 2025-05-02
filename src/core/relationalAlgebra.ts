import { ParsedQuery } from "../types/Query";



export function toRelationalAlgebra(parsed: ParsedQuery): string {
  //console.log("🧠 DEBUG parsed.from =", parsed.from)

  // FROM com seleção local
  let base = parsed.from.table;
  if (parsed.from.where) {
    base = `σ ${parsed.from.where} (${base})`;
  }

  // JOINs com seleção local
  const joinPart = parsed.joins.reduce((acc, join) => {
    let joinTable = join.table;
    if (join.where) {
      joinTable = `σ ${join.where} (${join.table})`;
    }
    return `(${acc} ⨝ ${join.condition} ${joinTable})`;
  }, base);

  // Seleção global
  let result = joinPart;
  if (parsed.where) {
    result = `σ ${parsed.where} (${result})`;
  }

  // Projeção final
  if (parsed.select.length) {
    result = `π ${parsed.select.join(", ")} (${result})`;
  }

  return String(result);
}
