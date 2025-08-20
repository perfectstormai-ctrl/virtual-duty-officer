import fs from 'fs/promises';
import path from 'path';
import { Task } from '../mcp/dispatcher';

interface SitrepContext {
  incidents_dir: string;
  sop_file?: string;
  output_dir?: string;
}

export async function handleSitrep(task: Task): Promise<string> {
  const ctx: SitrepContext = task.context;
  const incidentSummary = await loadIncidentSummary(ctx.incidents_dir);
  const sopText = ctx.sop_file ? await loadFileSafe(ctx.sop_file) : '';
  const promptTemplate = await loadPrompt();
  const timestamp = new Date().toISOString();
  const prompt = promptTemplate
    .replace('{{incident_summary}}', incidentSummary)
    .replace('{{sop_text}}', sopText)
    .replace('{{timestamp}}', timestamp);
  const response = await callClaude(prompt);
  const outputDir = ctx.output_dir || path.resolve(__dirname, '../outputs/sitreps');
  await fs.mkdir(outputDir, { recursive: true });
  const filename = `SITREP_${timestamp.replace(/[:]/g, '').replace(/\.\d+Z$/, '')}.md`;
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, response);
  return outputPath;
}

async function loadIncidentSummary(dir: string): Promise<string> {
  try {
    const files = await fs.readdir(dir);
    const incidents = [] as any[];
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const content = await fs.readFile(path.join(dir, file), 'utf8');
      incidents.push(JSON.parse(content));
    }
    return JSON.stringify(incidents, null, 2);
  } catch {
    return '';
  }
}

async function loadPrompt(): Promise<string> {
  const promptPath = path.resolve(__dirname, '../prompts/sitrep_prompt.md');
  return fs.readFile(promptPath, 'utf8');
}

async function loadFileSafe(file: string): Promise<string> {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

async function callClaude(prompt: string): Promise<string> {
  // Placeholder for actual Claude API call
  return `SITREP RESPONSE\n\n${prompt}`;
}
