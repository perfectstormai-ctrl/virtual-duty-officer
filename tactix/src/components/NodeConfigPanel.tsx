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

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(node.id, { ...node.data, [name]: value });
  };

  const handleConfigChange = (key: string, value: string) => {
    const cfg = { ...(node.data.config || {}) };
    cfg[key] = value;
    onChange(node.id, { ...node.data, config: cfg });
  };

  const addConfigEntry = () => {
    const key = prompt('Config key');
    if (!key) return;
    const cfg = { ...(node.data.config || {}) };
    cfg[key] = '';
    onChange(node.id, { ...node.data, config: cfg });
  };

  return (
    <div style={{ width: 200, padding: 10 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input
          name="label"
          value={node.data.label || ''}
          onChange={handleFieldChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Input Key</label>
        <input
          name="inputKey"
          value={(node.data as any).inputKey || ''}
          onChange={handleFieldChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Output Key</label>
        <input
          name="outputKey"
          value={(node.data as any).outputKey || ''}
          onChange={handleFieldChange}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>Config</label>
          <button onClick={addConfigEntry}>+</button>
        </div>
        {Object.entries(node.data.config || {}).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 4 }}>
            <input
              value={key}
              disabled
              style={{ width: '40%', marginRight: 4 }}
            />
            <input
              value={val as any}
              onChange={e => handleConfigChange(key, e.target.value)}
              style={{ width: '55%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
