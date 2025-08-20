import fs from 'fs';
import path from 'path';
import { dispatchTask, Task } from './dispatcher';

const TASK_QUEUE_DIR = path.resolve(__dirname, '../tasks/queue');
const LOG_FILE = path.resolve(__dirname, '../logs/mcp_tasks.json');

async function loadTaskFiles(): Promise<string[]> {
  await fs.promises.mkdir(TASK_QUEUE_DIR, { recursive: true });
  const files = await fs.promises.readdir(TASK_QUEUE_DIR);
  return files.filter(f => f.endsWith('.json')).map(f => path.join(TASK_QUEUE_DIR, f));
}

function appendLog(entry: any) {
  let log: any[] = [];
  if (fs.existsSync(LOG_FILE)) {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    if (content.trim()) {
      log = JSON.parse(content);
    }
  }
  log.push(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

async function processTaskFile(filePath: string) {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    const task: Task = JSON.parse(raw);
    if (!task.type || !task.task_id || task.context === undefined) {
      throw new Error('Missing required fields');
    }
    const output = await dispatchTask(task);
    appendLog({ task_id: task.task_id, type: task.type, status: 'success', timestamp: new Date().toISOString(), output });
    await fs.promises.unlink(filePath);
  } catch (err: any) {
    appendLog({ task_id: undefined, type: undefined, status: 'error', timestamp: new Date().toISOString(), error: err.message });
    await fs.promises.unlink(filePath).catch(() => {});
  }
}

export async function runAgent() {
  const files = await loadTaskFiles();
  for (const file of files) {
    await processTaskFile(file);
  }
}

export function startAgent(intervalMs = 5000) {
  runAgent();
  setInterval(runAgent, intervalMs);
}

if (require.main === module) {
  startAgent();
}
