import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { OperatorNode } from '../types/Operator';

type Props = {
  nodes: OperatorNode[];
};

export const OperatorGraph = ({ nodes }: Props) => {
  // Posicionamento simples vertical
  const verticalSpacing = 100;
  const reactFlowNodes = nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: 250, y: index * verticalSpacing },
    type: 'default',
  }));

  const reactFlowEdges = nodes.flatMap((node) =>
    node.inputs.map((input) => ({
      id: `e-${input}-${node.id}`,
      source: input,
      target: node.id,
      type: 'smoothstep',
    }))
  );

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
