import React from 'react';

export default function ExecutionConsole({ logs }: { logs: string[] }) {
  return (
    <div style={{ height: 150, overflow: 'auto', background: '#111', color: '#0f0', padding: 4 }}>
      {logs.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
