import React from 'react';

const groups = [
  {
    title: 'Trigger',
    color: '#bbf7d0',
    nodes: [
      { type: 'file_watch', label: 'File Watcher' },
      { type: 'manual_start', label: 'Manual Start' }
    ]
  },
  {
    title: 'Agent',
    color: '#bfdbfe',
    nodes: [
      { type: 'claude', label: 'Claude' },
      { type: 'codex', label: 'Codex' },
      { type: 'sop_reasoner', label: 'SOP Reasoner' }
    ]
  },
  {
    title: 'Context',
    color: '#e9d5ff',
    nodes: [
      { type: 'bundle_injector', label: 'Bundle Injector' },
      { type: 'data_enricher', label: 'Data Enricher' }
    ]
  },
  {
    title: 'Logic',
    color: '#fbcfe8',
    nodes: [
      { type: 'if', label: 'IF' },
      { type: 'map', label: 'Map' },
      { type: 'wait', label: 'Wait' }
    ]
  },
  {
    title: 'Output',
    color: '#fde68a',
    nodes: [
      { type: 'write_json', label: 'Write JSON' },
      { type: 'push_claude', label: 'Push to Claude' },
      { type: 'store_sitrep', label: 'Store SITREP' }
    ]
  }
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: 200, background: '#f4f4f4', padding: 10, overflowY: 'auto' }}>
      {groups.map(group => (
        <div key={group.title} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{group.title}</div>
          {group.nodes.map(n => (
            <div
              key={n.type}
              style={{
                marginBottom: 6,
                padding: 4,
                border: '1px solid #ccc',
                cursor: 'grab',
                background: group.color
              }}
              onDragStart={e => onDragStart(e, n.type)}
              draggable
            >
              {n.label}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
