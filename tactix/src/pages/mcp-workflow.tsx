import React, { useCallback, useRef, useState } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge, useReactFlow } from 'reactflow';
import WorkflowCanvas from '../components/WorkflowCanvas';
import NodePalette from '../components/NodePalette';
import NodeConfigPanel from '../components/NodeConfigPanel';
import ExecutionConsole from '../components/ExecutionConsole';
import { exportWorkflow, importWorkflow } from '../lib/WorkflowSerializer';
import { runWorkflow } from '../lib/WorkflowEngineMock';

function WorkflowEditor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selected, setSelected] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { project } = useReactFlow();

  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = project({ x: event.clientX, y: event.clientY });
    const newNode = { id: `${type}_${nodes.length}`, type: 'default', position, data: { label: type } };
    setNodes((nds) => nds.concat(newNode));
  }, [project, nodes, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const onSelectionChange = useCallback((params: { nodes: any[] }) => {
    setSelected(params.nodes[0] || null);
  }, []);

  const updateNode = (id: string, data: any) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data } : n));
  };

  const handleExport = () => {
    const json = exportWorkflow({ nodes, edges });
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const flow = await importWorkflow(file);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
  };

  const handleRun = async () => {
    setLogs([]);
    await runWorkflow({ nodes, edges }, (m) => setLogs((l) => [...l, m]));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NodePalette />
      <div style={{ flex: 1 }} ref={wrapperRef} onDrop={onDrop} onDragOver={onDragOver}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
        />
      </div>
      <NodeConfigPanel node={selected} onChange={updateNode} />
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
        <button onClick={handleExport}>Export</button>
        <label style={{ cursor: 'pointer' }}>
          Import
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
        </label>
        <button onClick={handleRun}>Run</button>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <ExecutionConsole logs={logs} />
      </div>
    </div>
  );
}

export default function MCPWorkflowPage() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}
