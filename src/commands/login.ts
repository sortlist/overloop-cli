import { createInterface } from 'readline';
import { OverloopAPI } from '../api';
import { saveConfig, getConfigPath } from '../config';

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function login() {
  process.stderr.write('\n Overloop CLI — Login\n\n');
  process.stderr.write(' Enter your API key (from Settings > API Keys in your Overloop dashboard).\n\n');

  const apiKey = await prompt(' API key: ');

  if (!apiKey) {
    console.error('\n No API key provided. Aborting.');
    process.exit(1);
  }

  process.stderr.write('\n Verifying...');

  try {
    const api = new OverloopAPI({ apiKey });
    const result = await api.getAccount();
    const name = result?.name || 'your account';

    saveConfig({ apiKey });

    process.stderr.write(' OK\n\n');
    process.stderr.write(` Authenticated successfully. Connected to ${name}.\n`);
    process.stderr.write(` Config saved to ${getConfigPath()}\n\n`);
  } catch (error: any) {
    process.stderr.write(' FAILED\n\n');
    console.error(` Invalid API key: ${error.message}`);
    process.exit(1);
  }
}

export async function logout() {
  const { existsSync, unlinkSync } = await import('fs');
  const configPath = getConfigPath();

  if (existsSync(configPath)) {
    unlinkSync(configPath);
    process.stderr.write('Logged out. Config removed.\n');
  } else {
    process.stderr.write('No saved config found.\n');
  }
}
