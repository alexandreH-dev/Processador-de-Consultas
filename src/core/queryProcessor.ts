import { OperatorNode } from "../types/Operator";

export function processQuery(nodes: OperatorNode[]): string[] {
  const executed: string[] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  function execute(nodeId: string) {
    const node = nodeMap.get(nodeId);
    if (!node) return;
    node.inputs.forEach(inputId => {
      if (!executed.includes(inputId)) {
        execute(inputId);
      }
    });
    if (!executed.includes(nodeId)) {
      executed.push(nodeId);
    }
  }

  // Começar pela projeção se existir, senão pela seleção
  const startNode = nodeMap.get("projection") || nodeMap.get("selection") || nodes[0];
  if (startNode) {
    execute(startNode.id);
  }

  // 🧠 Traduzir operação com símbolo
  return executed.map(id => {
    const node = nodeMap.get(id);
    if (!node) return id;
    switch (node.type) {
      case "Selection":
        return `σ ${node.label}`;
      case "Join":
        return `⨝ ${node.label}`;
      case "Projection":
        return `π ${node.label}`;
      case "Table":
        return node.label;
      default:
        return `${node.type}: ${node.label}`;
    }
  });
}
