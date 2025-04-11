import { ParsedQuery } from "../types/Query";


export function toRelationalAlgebra(parsed: ParsedQuery): string {
  let result = "";

  if (parsed.joins.length) {
    result = parsed.joins.reduce(
      (acc, join) => `(${acc} ⨝ ${join.condition} ${join.table})`,
      parsed.from
    );
  } else {
    result = parsed.from;
  }

  if (parsed.where) result = `σ(${parsed.where})(${result})`;
  if (parsed.select) result = `π(${parsed.select.join(", ")})(${result})`;

  return result;
}
