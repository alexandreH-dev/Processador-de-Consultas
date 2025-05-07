import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useMemo } from 'react';
import { OperatorNode } from '../types/Operator';

type Props = {
  nodes: OperatorNode[];
};

const nodeWidth = 180;
const nodeHeight = 60;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const OperatorGraph = ({ nodes }: Props) => {
  const { reactFlowNodes, reactFlowEdges } = useMemo(() => {
    dagreGraph.setGraph({ rankdir: 'BT' }); 
    const rfNodes = nodes.map((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      return {
        id: node.id,
        data: { label: node.label },
        position: { x: 0, y: 0 }, // será calculado
        type: 'default',
      };
    });

    const rfEdges = nodes.flatMap((node) =>
      node.inputs.map((input) => {
        dagreGraph.setEdge(input, node.id);
        return {
          id: `e-${input}-${node.id}`,
          source: input,
          target: node.id,
          type: 'smoothstep',
        };
      })
    );

    dagre.layout(dagreGraph);

    rfNodes.forEach((node) => {
      const pos = dagreGraph.node(node.id);
      node.position = { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 };
    });

    return { reactFlowNodes: rfNodes, reactFlowEdges: rfEdges };
  }, [nodes]);

  return (
    <div style={{ height: 600 }}>
      <ReactFlow nodes={reactFlowNodes} edges={reactFlowEdges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
