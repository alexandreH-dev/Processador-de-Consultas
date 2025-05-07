import { ParsedQuery } from "../types/Query";
import { OperatorNode } from "../types/Operator";

let nodeCount = 0;
const newId = () => `n${nodeCount++}`;

export function buildOperatorGraph(parsed: ParsedQuery): OperatorNode[] {
  const nodes: OperatorNode[] = [];
  const tableOutputs: Record<string, string> = {};

  // 1. FROM principal
  const baseTable = parsed.from.table;
  const fromBaseId = baseTable;

  nodes.push({
    id: fromBaseId,
    type: "Table",
    label: baseTable,
    inputs: [],
  });

  let fromCurrentId = fromBaseId;

  if (parsed.from.where) {
    const selId = newId();
    nodes.push({
      id: selId,
      type: "Selection",
      label: parsed.from.where,
      inputs: [fromCurrentId],
    });
    fromCurrentId = selId;
  }

  const fromProjAttrs = getAttributesUsedFor(baseTable, parsed);
  if (fromProjAttrs.length) {
    const projId = newId();
    nodes.push({
      id: projId,
      type: "Projection",
      label: fromProjAttrs.join(", "),
      inputs: [fromCurrentId],
    });
    fromCurrentId = projId;
  }

  tableOutputs[baseTable] = fromCurrentId;

  // 2. JOINs com seleção e projeção local
  let currentJoinId = fromCurrentId;

  parsed.joins.forEach((join, index) => {
    const tableId = join.table;
    nodes.push({
      id: tableId,
      type: "Table",
      label: tableId,
      inputs: [],
    });

    let tableCurrentId = tableId;

    if (join.where) {
      const selId = newId();
      nodes.push({
        id: selId,
        type: "Selection",
        label: join.where,
        inputs: [tableCurrentId],
      });
      tableCurrentId = selId;
    }

    const projAttrs = getAttributesUsedFor(tableId, parsed);
    if (projAttrs.length) {
      const projId = newId();
      nodes.push({
        id: projId,
        type: "Projection",
        label: projAttrs.join(", "),
        inputs: [tableCurrentId],
      });
      tableCurrentId = projId;
    }

    const joinId = `join${index}`;
    nodes.push({
      id: joinId,
      type: "Join",
      label: join.condition,
      inputs: [currentJoinId, tableCurrentId],
    });

    currentJoinId = joinId;
    tableOutputs[tableId] = tableCurrentId;
  });

  // 3. Seleção global (WHERE residual)
  let finalOpId = currentJoinId;
  if (parsed.where) {
    const selId = newId();
    nodes.push({
      id: selId,
      type: "Selection",
      label: parsed.where,
      inputs: [finalOpId],
    });
    finalOpId = selId;
  }

  // 4. Projeção final
  const projId = newId();
  nodes.push({
    id: projId,
    type: "Projection",
    label: parsed.select.join(", "),
    inputs: [finalOpId],
  });

  return nodes;
}

// 🧩 Utilitário: extrai atributos usados por tabela
function getAttributesUsedFor(table: string, parsed: ParsedQuery): string[] {
  const used = new Set<string>();
  const lowerTable = table.toLowerCase();

  parsed.select.forEach(sel => {
    const [tbl, attr] = sel.split(".");
    if (tbl?.toLowerCase() === lowerTable) used.add(attr);
  });

  parsed.joins.forEach(j => {
    const matches = j.condition.match(/\b(\w+)\.(\w+)\b/g);
    matches?.forEach(m => {
      const [tbl, attr] = m.split(".");
      if (tbl?.toLowerCase() === lowerTable) used.add(attr);
    });
  });

  return Array.from(used);
}
