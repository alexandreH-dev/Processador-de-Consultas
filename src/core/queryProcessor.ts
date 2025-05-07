import { OperatorNode } from "../types/Operator";

export function processQuery(nodes: OperatorNode[]): string[] {
  const executed: Set<string> = new Set();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  function visit(nodeId: string) {
    const node = nodeMap.get(nodeId);
    if (!node || executed.has(nodeId)) return;

    // Visita todos os inputs antes
    node.inputs.forEach(inputId => visit(inputId));

    // Depois adiciona o atual
    executed.add(nodeId);
  }

  // Começar por todos os nós do tipo Projection (podem existir múltiplos)
  const rootProjections = nodes.filter(n => n.type === "Projection");

  rootProjections.forEach(n => visit(n.id));

  // Ordenar resultado pela sequência de execução correta
  const result: string[] = [];
  executed.forEach(id => {
    const node = nodeMap.get(id);
    if (!node) return;

    const prefix = symbolFor(node.type);
    result.push(prefix ? `${prefix} ${node.label}` : node.label);
  });

  return result;
}

// 🧩 Símbolos da álgebra
function symbolFor(type: string): string {
  switch (type) {
    case "Selection": return "σ";
    case "Projection": return "π";
    case "Join": return "⨝";
    case "Table": return ""; // ou R se quiser
    default: return "";
  }
}
