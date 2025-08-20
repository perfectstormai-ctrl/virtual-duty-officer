export interface Workflow {
  name?: string;
  nodes: any[];
  edges: any[];
}

export function exportWorkflow(flow: Workflow): string {
  return JSON.stringify(flow, null, 2);
}

export async function importWorkflow(file: File): Promise<Workflow> {
  const text = await file.text();
  return JSON.parse(text);
}
