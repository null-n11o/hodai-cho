import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const workflowPath = resolve(process.cwd(), '.github/workflows/deploy-cloudflare.yml');

describe('Cloudflare deployment workflow', () => {
  it('deploys only main pushes with the verified free workers.dev URL', () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, 'utf8');

    expect(workflow).toContain('push:');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('SITE_URL: https://tabeho.nakano-kentaro7.workers.dev');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npm test');
    expect(workflow).toContain('npm run lint');
    expect(workflow).toContain('npm run build:cloudflare');
    expect(workflow).toContain('cloudflare/wrangler-action@v4');
    expect(workflow).toContain('command: deploy');
    expect(workflow).toContain('secrets.CLOUDFLARE_API_TOKEN');
    expect(workflow).toContain('secrets.CLOUDFLARE_ACCOUNT_ID');
    expect(workflow).not.toContain('tabeho.com');

    const steps = [
      'npm ci',
      'npm test',
      'npm run lint',
      'npm run build:cloudflare',
      'command: deploy',
    ].map((step) => workflow.indexOf(step));

    expect(steps.every((index) => index >= 0)).toBe(true);
    expect(steps).toEqual([...steps].sort((a, b) => a - b));
  });
});
