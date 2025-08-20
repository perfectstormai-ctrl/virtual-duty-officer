import React from 'react';
import { Node } from 'reactflow';
import { WorkflowNodeData } from './WorkflowCanvas';

interface Props {
  node: Node<WorkflowNodeData> | null;
  onChange: (id: string, data: WorkflowNodeData) => void;
}

export default function NodeConfigPanel({ node, onChange }: Props) {
  if (!node) {
    return <div style={{ width: 200, padding: 10 }}>No node selected</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(node.id, { ...node.data, [name]: value });
  };

  return (
    <div style={{ width: 200, padding: 10 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input
          name="label"
          value={node.data.label || ''}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
