import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface OverloopConfig {
  apiKey: string;
}

const CONFIG_DIR = join(homedir(), '.overloop');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function saveConfig(config: OverloopConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
}

function loadSavedConfig(): OverloopConfig | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    if (data.apiKey) return { apiKey: data.apiKey };
  } catch {}
  return null;
}

export function getConfig(): OverloopConfig {
  const envKey = process.env.OVERLOOP_API_KEY;
  if (envKey) return { apiKey: envKey };

  const saved = loadSavedConfig();
  if (saved) return saved;

  console.error('Error: No API key found.');
  console.error('Run "overloop login" to authenticate, or set OVERLOOP_API_KEY environment variable.');
  process.exit(1);
}
