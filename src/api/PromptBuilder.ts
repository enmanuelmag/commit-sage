import { Change, ChangeWithDiff, ProviderConfig, Repository, Status, StatusType } from "../type";

const SYSTEM_PROMPT = `You are a helpful assistant that generates concise and clear commit messages based on git diffs.

Follow the Conventional Commits format And ONLY return the commit message without any additional text or formatting. The commit message should be in the format of <type>(<scope>): <description>, where:

The structure of the commit message should be as follows:
- <type>: A noun describing the type of change (e.g., feat, fix, docs, style, refactor, test, chore).
- <scope>: An optional noun describing the scope of the change (e.g., component or file name).
- <description>: A brief description of the change.

Example commit messages:
- feat(auth): add login functionality
- fix(api): resolve user authentication bug
- docs(readme): update installation instructions
- style(button): improve button styling
- refactor(user-service): optimize user data fetching
- test(auth): add tests for login functionality
- chore(deps): update dependencies

When generating the commit message, analyze the provided git diff and identify the most significant change. Focus on the main purpose of the change rather than listing every modification. If multiple types of changes are present, prioritize them in the following order: feat > fix > docs > style > refactor > test > chore.

Remember to keep the commit message concise and informative, accurately reflecting the essence of the changes made in the git diff. Do not include any additional explanations or details beyond the commit message itself.

MANDATORY:
- ONLY return the commit message in the specified format.
- Do NOT include any additional text, explanations, or formatting.
- Analyze the git diff to determine the most significant change and generate a commit message that accurately reflects that change.
- Prioritize the types of changes in the following order: feat > fix > docs > style > refactor > test > chore.
`;

class PromptBuilder {

  static getSystemPrompt(): string {
    return SYSTEM_PROMPT;
  }

  private static readonly STATUS_MAP = new Map<Status, StatusType>([
    [Status.INDEX_MODIFIED, 'modified'],
    [Status.MODIFIED, 'modified'],
    [Status.INDEX_ADDED, 'added'],
    [Status.ADDED_BY_THEM, 'added'],
    [Status.ADDED_BY_US, 'added'],
    [Status.BOTH_ADDED, 'added'],
    [Status.INTENT_TO_ADD, 'added'],
    [Status.INDEX_DELETED, 'deleted'],
    [Status.DELETED, 'deleted'],
    [Status.DELETED_BY_THEM, 'deleted'],
    [Status.DELETED_BY_US, 'deleted'],
    [Status.BOTH_DELETED, 'deleted'],
    [Status.UNTRACKED, 'untracked'],
  ]);

  static async buildPrompt(changes: Change[], config: ProviderConfig, repo: Repository): Promise<string> {
    const allChangesWithDiff: ChangeWithDiff[] = [];

    const MAX_DIFF_SIZE = config.maxDiffSize ?? 500;

    for (const change of changes) {
      const status = this.STATUS_MAP.get(change.status) ?? 'other' as const;

      let diff = undefined;

      if (status === 'modified') {
        try {
          diff = await repo.diffIndexWithHEAD(change.uri.fsPath);
          if (diff.length > MAX_DIFF_SIZE) {
            diff = diff.substring(0, MAX_DIFF_SIZE) + '\n... (diff truncated)';
          }
        } catch (error) {
          diff = `Error generating diff: ${error}`;
        }
      }

      allChangesWithDiff.push({
        uri: change.uri.path,
        status: status as Exclude<StatusType, 'modified'>,
      });
    }

    let changeSummaries = '';

    for (const change of allChangesWithDiff) {
      const status = change.status;
      const filePath = change.uri.split('/').slice(-4).join('/');

      if (status === 'modified' && change.diff) {
        changeSummaries += `- ${status}: ${filePath}\n\`\`\`diff\n${change.diff}\n\`\`\`\n`;
      } else {
        changeSummaries += `- ${status}: ${filePath}\n`;
      }
    }

    return `Here are the changes:\n${changeSummaries}`;
  }
}

export default PromptBuilder;
