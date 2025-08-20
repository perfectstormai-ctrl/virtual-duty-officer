import { Workflow } from './WorkflowSerializer';

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export async function runWorkflow(
  flow: Workflow,
  logger: (msg: string) => void,
  highlight?: (id: string) => void
) {
  for (const node of flow.nodes) {
    logger(`Executing ${node.id}`);
    if (highlight) highlight(node.id);
    await sleep(300);
  }
  logger('Workflow complete');
}
