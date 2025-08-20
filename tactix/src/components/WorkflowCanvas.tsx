import React from 'react';
import ReactFlow, { Background, Controls, Connection, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

export interface WorkflowNodeData {
  label: string;
  inputKey?: string;
  outputKey?: string;
  config?: Record<string, any>;
}

export interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  onSelectionChange?: (params: { nodes: Node[] }) => void;
}

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlow {...props} fitView>
      <Background />
      <Controls />
    </ReactFlow>
  );
}
