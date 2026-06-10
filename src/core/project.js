import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function initProject(path) {
  const targetDir = join(process.cwd(), path);
  const verifaiDir = join(targetDir, '.verifai');

  try {
    if (!existsSync(verifaiDir)) {
      mkdirSync(verifaiDir, { recursive: true });
    }

    const config = {
      version: '0.1.0',
      project: path,
      settings: {
        autoTrack: false,
        enforceOnCommit: false,
      },
      invariants: [],
    };

    writeFileSync(
      join(verifaiDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );

    writeFileSync(
      join(verifaiDir, 'invariants.json'),
      JSON.stringify(
        {
          version: '1.0',
          rules: [
            {
              name: 'no-hardcoded-secrets',
              pattern: '(password|secret|api[_-]?key|token)\\s*[:=]\\s*["\']',
              message: 'Potential hardcoded secret detected',
              level: 'error',
            },
            {
              name: 'no-console-log',
              pattern: 'console\\.log\\(',
              message: 'Remove console.log before production',
              level: 'warning',
            },
            {
              name: 'no-todo-left',
              pattern: 'TODO|FIXME|HACK|XXX',
              message: 'Unresolved TODO/FIXME found',
              level: 'warning',
            },
          ],
        },
        null,
        2
      )
    );

    const gitignorePath = join(targetDir, '.gitignore');
    if (existsSync(gitignorePath)) {
      const content = require('fs').readFileSync(gitignorePath, 'utf-8');
      if (!content.includes('.verifai/decisions.jsonl')) {
        require('fs').appendFileSync(
          gitignorePath,
          '\n# VerifAI\n.verifai/decisions.jsonl\n'
        );
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
