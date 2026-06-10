import chalk from 'chalk';
import { initProject } from '../core/project.js';

export async function initHandler(path) {
  console.log(chalk.cyan('\n  ╔══════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║          VerifAI v0.1.0               ║'));
  console.log(chalk.cyan('  ║  AI Output Verification Layer         ║'));
  console.log(chalk.cyan('  ╚══════════════════════════════════════╝\n'));

  const result = await initProject(path);
  if (result.success) {
    console.log(chalk.green('  ✓') + ' VerifAI initialized');
    console.log(chalk.green('  ✓') + ' Database created');
    console.log(chalk.green('  ✓') + ' Configuration set up');
    console.log('');
    console.log(chalk.dim('  Next steps:'));
    console.log(chalk.white('  verifai track -m "claude" -p "my prompt" -o "output.js"'));
    console.log(chalk.white('  verifai audit'));
    console.log(chalk.white('  verifai enforce ./src --rules .verifai/invariants.json'));
    console.log('');
  } else {
    console.log(chalk.red('  ✗') + ' Failed: ' + result.error);
  }
}
