import Logger from '../utils/Logger';
import PromptBuilder from '../api/PromptBuilder';
import CommitLintValidator from '../utils/CommitLintValidator';
import { Repository, ProviderConfig, ApiType } from '../type';
import ProviderFactory from '../api/ProviderFactory';
import { ErrorHandler } from '../utils/ErrorHandler';

export class CommitMessageGenerator {
  static async generateAndRefine(
    repo: Repository,
    allChanges: any[],
    apiType: ApiType,
    providerConfig: ProviderConfig,
    maxRetries: number
  ): Promise<string | undefined> {
    try {
      // Validate inputs
      if (allChanges.length === 0) {
        ErrorHandler.handleNoChanges();
        return undefined;
      }

      if (!providerConfig.apiUrl) {
        ErrorHandler.handleConfigError('API URL');
        return undefined;
      }

      Logger.info(`Using API Type: ${apiType}`);

      const provider = ProviderFactory.createProvider(apiType);
      const prompt = await PromptBuilder.buildPrompt(allChanges, providerConfig, repo);
      const repoPath = repo.rootUri.fsPath;

      let message = await provider.generateCommitMessage(prompt, providerConfig, repoPath);
      let validationAttempt = 0;

      // Validation and refinement loop
      while (validationAttempt < maxRetries) {
        const validation = await CommitLintValidator.validateMessage(message, repoPath);

        if (validation.valid) {
          Logger.info('Commit message passed commitlint validation');
          break;
        }

        validationAttempt++;
        Logger.warn(`Commit message failed commitlint validation: ${validation.errors.join(', ')}`);

        if (validationAttempt >= maxRetries) {
          Logger.warn(`Max commitlint refinement attempts (${maxRetries}) reached. Using message as-is.`);
          break;
        }

        const refinementPrompt = PromptBuilder.buildRefinementPrompt(message, validation.errors);
        Logger.info(`Refining commit message (attempt ${validationAttempt}/${maxRetries})...`);
        message = await provider.generateCommitMessage(refinementPrompt, providerConfig, repoPath);
      }

      return message;
    } catch (error) {
      ErrorHandler.handleError('Failed to generate commit message', error);
      return undefined;
    }
  }
}
