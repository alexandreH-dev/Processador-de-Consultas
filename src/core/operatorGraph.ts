import { ParsedQuery } from "../types/Query";
import { OperatorNode } from "../types/Operator";

export function buildOperatorGraph(parsed: ParsedQuery): OperatorNode[] {
  const nodes: OperatorNode[] = [];

  const tableNodes: { [tableName: string]: string } = {};

  // 1. FROM principal (com seleção local se houver)
  const fromTable = parsed.from.table;
  let fromOutputId = fromTable;

  nodes.push({
    id: fromTable,
    type: "Table",
    label: fromTable,
    inputs: [],
  });

  if (parsed.from.where) {
    const selectionId = `selection_${fromTable}`;
    nodes.push({
      id: selectionId,
      type: "Selection",
      label: parsed.from.where,
      inputs: [fromTable],
    });
    fromOutputId = selectionId;
  }

  tableNodes[fromTable] = fromOutputId;

  // 2. JOINs (com seleção local se houver)
  let lastJoinId: string = fromOutputId;

  parsed.joins.forEach((join, index) => {
    const joinTable = join.table;
    let joinTableOutputId = joinTable;

    nodes.push({
      id: joinTable,
      type: "Table",
      label: joinTable,
      inputs: [],
    });

    if (join.where) {
      const selectionId = `selection_${joinTable}`;
      nodes.push({
        id: selectionId,
        type: "Selection",
        label: join.where,
        inputs: [joinTable],
      });
      joinTableOutputId = selectionId;
    }

    const joinId = `join${index}`;
    nodes.push({
      id: joinId,
      type: "Join",
      label: join.condition,
      inputs: [lastJoinId, joinTableOutputId],
    });

    lastJoinId = joinId;
  });

  // 3. Seleção global (restante)
  let lastOpId = lastJoinId;

  if (parsed.where) {
    const globalSelId = "selection_global";
    nodes.push({
      id: globalSelId,
      type: "Selection",
      label: parsed.where,
      inputs: [lastJoinId],
    });
    lastOpId = globalSelId;
  }

  // 4. Projeção final
  if (parsed.select && parsed.select.length > 0) {
    nodes.push({
      id: "projection",
      type: "Projection",
      label: parsed.select.join(", "),
      inputs: [lastOpId],
    });
  }

  // Debug: logar estrutura no console
  console.log("🔍 buildOperatorGraph - tableNodes:", tableNodes);
  console.log("🧠 buildOperatorGraph - nodes:", nodes);

  return nodes;
}
