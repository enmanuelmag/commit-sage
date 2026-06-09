import Logger from './Logger';
import * as path from 'path';
import * as fs from 'fs';
import { CommitLintConfig } from '../type';

const COMMIT_RULES_DEFAULT = `Conventional Commits format rules:
- <type>: A noun describing the type of change (e.g., feat, fix, docs, style, refactor, test, chore).
- <scope>: An optional noun describing the scope of the change (e.g., component or file name).
- <description>: A brief description of the change.

Commit message structure: <type>(<scope>): <description>

Type priority order (when multiple types present):
- feat > fix > docs > style > refactor > test > chore

Additional requirements:
- ONLY return the commit message in the specified format.
- Do NOT include any additional text, explanations, or formatting.
- Analyze the git diff to determine the most significant change.
- Keep the commit message concise and informative.`;

export class CommitLintRuleExtractor {
  private static configFiles = [
    '.commitlintrc',
    '.commitlintrc.json',
    '.commitlintrc.js',
    '.commitlintrc.cjs',
    'commitlint.config.js',
    'commitlint.config.cjs',
    '.commitlintrc.yml',
    '.commitlintrc.yaml',
  ];

  static async extractRules(repoPath: string): Promise<string> {
    try {
      let configPath: string | undefined;

      for (const file of this.configFiles) {
        const fullPath = path.join(repoPath, file);
        if (fs.existsSync(fullPath)) {
          configPath = fullPath;
          break;
        }
      }

      if (!configPath) {
        Logger.debug('No commitlint config found in repository');
        return COMMIT_RULES_DEFAULT;
      }

      const ext = path.extname(configPath);

      let config: CommitLintConfig | undefined;

      if (ext === '.json' || configPath.endsWith('.json') || configPath === path.join(repoPath, '.commitlintrc')) {
        const content = fs.readFileSync(configPath, 'utf-8');
        config = JSON.parse(content);
      } else if (ext === '.js' || ext === '.cjs' || ext === '' && configPath.includes('.js')) {
        const configModule = await import(configPath);
        config = configModule.default || configModule;
      } else if (ext === '.yml' || ext === '.yaml') {
        Logger.debug('YAML commitlint config not supported in this version');
        return COMMIT_RULES_DEFAULT;
      }

      if (!config || !config.rules) {
        Logger.debug('Commitlint config found but no rules defined');
        return COMMIT_RULES_DEFAULT;
      }

      let rulesText = 'CommitLint Rules for this project:\n\n';
      let rulesFound = false;

      if (config.rules['type-enum']?.[2]) {
        const allowedTypes = config.rules['type-enum'][2];
        rulesText += `• Allowed types: ${allowedTypes.join(', ')}\n`;
        rulesFound = true;
      }

      if (config.rules['subject-case']) {
        rulesText += '• Subject must follow case rules\n';
        rulesFound = true;
      }

      if (config.rules['subject-empty'] && config.rules['subject-empty'][0] === 2) {
        rulesText += '• Subject cannot be empty\n';
        rulesFound = true;
      }

      if (config.rules['subject-max-length']?.[2]) {
        const maxLength = config.rules['subject-max-length'][2];
        rulesText += `• Subject max length: ${maxLength} characters\n`;
        rulesFound = true;
      }

      if (config.rules['scope-empty']) {
        rulesText += '• Scope rules apply\n';
        rulesFound = true;
      }

      if (config.rules['body-max-line-length']?.[2]) {
        const maxLineLength = config.rules['body-max-line-length'][2];
        rulesText += `• Body max line length: ${maxLineLength} characters\n`;
        rulesFound = true;
      }

      if (!rulesFound) {
        Logger.debug('Commitlint config has rules but no extractable rules found');
        return COMMIT_RULES_DEFAULT;
      }

      return rulesText;
    } catch (error) {
      Logger.debug(`Error extracting commitlint rules: ${error instanceof Error ? error.message : String(error)}`);
      return COMMIT_RULES_DEFAULT;
    }
  }
}
