import React from 'react';

const nodeList = [
  { type: 'file_watch', label: 'File Watcher' },
  { type: 'manual_start', label: 'Manual Start' },
  { type: 'claude', label: 'Claude Agent' },
  { type: 'codex', label: 'Codex Agent' },
  { type: 'sop_reasoner', label: 'SOP Reasoner' },
  { type: 'bundle_injector', label: 'Bundle Injector' },
  { type: 'data_enricher', label: 'Data Enricher' },
  { type: 'if', label: 'IF' },
  { type: 'map', label: 'Map' },
  { type: 'wait', label: 'Wait' },
  { type: 'write_json', label: 'Write JSON' },
  { type: 'push_claude', label: 'Push to Claude' },
  { type: 'store_sitrep', label: 'Store SITREP' }
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: 200, background: '#f4f4f4', padding: 10, overflowY: 'auto' }}>
      {nodeList.map(n => (
        <div key={n.type}
             style={{ marginBottom: 8, padding: 4, border: '1px solid #ccc', cursor: 'grab' }}
             onDragStart={e => onDragStart(e, n.type)}
             draggable>
          {n.label}
        </div>
      ))}
    </aside>
  );
}
