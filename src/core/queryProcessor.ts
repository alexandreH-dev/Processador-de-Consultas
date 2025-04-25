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

  return executed.map(id => nodeMap.get(id)?.label || id);
}
