import Logger from "../utils/Logger";
import GitContext from "../utils/GitContext";
import { CommitLintRuleExtractor } from "../utils/CommitLintRuleExtractor";

import { Change, ProviderConfig, Repository } from "../type";

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

const SYSTEM_PROMPT = `You are a helpful assistant that generates concise and clear commit messages based on git diffs.

Follow the Conventional Commits format and ONLY return the commit message without any additional text or formatting.

Example commit messages:
- feat(auth): add login functionality
- fix(api): resolve user authentication bug
- docs(readme): update installation instructions
- style(button): improve button styling
- refactor(user-service): optimize user data fetching
- test(auth): add tests for login functionality
- chore(deps): update dependencies

When generating the commit message, analyze the provided git diff and identify the most significant change. Focus on the main purpose of the change rather than listing every modification.

MANDATORY RULES (from project configuration):
{COMMIT_RULES_PLACEHOLDER}
`;

class PromptBuilder {

  static async getSystemPrompt(repoPath?: string): Promise<string> {
    let commitRules = COMMIT_RULES_DEFAULT;

    if (repoPath) {
      commitRules = await CommitLintRuleExtractor.extractRules(repoPath);
      Logger.info('Commit lint detected');
    }

    return SYSTEM_PROMPT.replace('{COMMIT_RULES_PLACEHOLDER}', commitRules);
  }

  static buildRefinementPrompt(
    originalMessage: string,
    validationErrors: string[]
  ): string {
    return `Please refine this commit message to pass these commitlint rules:

Errors:
${validationErrors.map(e => `- ${e}`).join('\n')}

Original message:
${originalMessage}

Provide only the refined commit message, no explanations.`;
  }

  static async buildPrompt(changes: Change[], config: ProviderConfig, repo: Repository): Promise<string> {

    const promises = [
      GitContext.buildChangeWithDiff(changes, config, repo),
      GitContext.buildPreviousCommits(config, repo),
    ] as const;

    const [changesWithDiff, previousCommits] = await Promise.all(promises);

    let prompt = `Here are the changes:\n${changesWithDiff}\n`;

    if (previousCommits) {
      prompt += `\nHere are the previous commits:\n${previousCommits}\n`;
    }

    prompt += `\nBased on the above changes, generate a concise commit message in the Conventional Commits format.`;

    return prompt;
  }
}

export default PromptBuilder;
