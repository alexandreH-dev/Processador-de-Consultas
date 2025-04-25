import { ParsedQuery } from "../types/Query";
import { OperatorNode } from "../types/Operator";

export function buildOperatorGraph(parsed: ParsedQuery): OperatorNode[] {
  const nodes: OperatorNode[] = [];

  // Cria nó da tabela principal
  nodes.push({
    id: parsed.from,
    type: "Table",
    label: parsed.from,
    inputs: [],
  });

  // Cria nós de join
  parsed.joins.forEach((join, index) => {
    nodes.push({
      id: `join${index}`,
      type: "Join",
      label: join.condition,
      inputs: [parsed.from, join.table],
    });
    nodes.push({
      id: join.table,
      type: "Table",
      label: join.table,
      inputs: [],
    });
  });

  // Cria nó de seleção
  if (parsed.where) {
    nodes.push({
      id: "selection",
      type: "Selection",
      label: parsed.where,
      inputs: parsed.joins.length > 0 ? [`join${parsed.joins.length - 1}`] : [parsed.from],
    });
  }

  // Cria nó de projeção
  if (parsed.select && parsed.select.length > 0) {
    nodes.push({
      id: "projection",
      type: "Projection",
      label: parsed.select.join(", "),
      inputs: ["selection"],
    });
  }

  return nodes;
}
