import Logger from './Logger';
import { CommitLintError } from '../type';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

class CommitLintValidator {
  private static commitLintLoadModule: any = null;
  private static commitLintLintModule: any = null;

  private static async getCommitLintLoad() {
    if (!CommitLintValidator.commitLintLoadModule) {
      CommitLintValidator.commitLintLoadModule = await import('@commitlint/load');
    }
    return CommitLintValidator.commitLintLoadModule.default;
  }

  private static async getCommitLintLint() {
    if (!CommitLintValidator.commitLintLintModule) {
      CommitLintValidator.commitLintLintModule = await import('@commitlint/lint');
    }
    return CommitLintValidator.commitLintLintModule.default;
  }

  static async hasCommitLintConfig(repoPath: string): Promise<boolean> {
    try {
      const load = await this.getCommitLintLoad();
      const config = await load({ cwd: repoPath });
      return !!config;
    } catch (error) {
      return false;
    }
  }

  static async validateMessage(message: string, repoPath: string): Promise<ValidationResult> {
    try {
      const hasConfig = await this.hasCommitLintConfig(repoPath);
      if (!hasConfig) {
        return { valid: true, errors: [] };
      }

      const load = await this.getCommitLintLoad();
      const lint = await this.getCommitLintLint();

      const config = await load({ cwd: repoPath });
      const report = await lint(message, config.rules);

      return {
        valid: report.valid,
        errors: report.errors.map((e: CommitLintError) => e.message)
      };
    } catch (error) {
      Logger.debug(`CommitLint validation error: ${error instanceof Error ? error.message : String(error)}`);
      // Graceful degradation: if validation fails, assume valid
      return { valid: true, errors: [] };
    }
  }
}

export default CommitLintValidator;
