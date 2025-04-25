import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { OperatorNode } from '../types/Operator';

type Props = {
  nodes: OperatorNode[];
};

export const OperatorGraph = ({ nodes }: Props) => {
  const elements = nodes.map((node) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: Math.random() * 250, y: Math.random() * 250 },
    type: "default",
  }));

  const edges = nodes.flatMap((node) =>
    node.inputs.map((input) => ({
      id: `e-${input}-${node.id}`,
      source: input,
      target: node.id,
      type: "smoothstep",
    }))
  );

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={elements}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
