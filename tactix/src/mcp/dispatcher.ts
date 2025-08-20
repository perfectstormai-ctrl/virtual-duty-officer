import { handleSitrep } from '../handlers/sitrep';

export interface Task {
  task_id: string;
  type: string;
  context: any;
  [key: string]: any;
}

export async function dispatchTask(task: Task): Promise<string> {
  switch (task.type) {
    case 'generate_sitrep':
      return await handleSitrep(task);
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }
}
