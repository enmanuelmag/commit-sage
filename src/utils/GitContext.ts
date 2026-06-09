import path from "path";

import Logger from "./Logger";
import { StatusMapper } from "./StatusMapper";

import { Change, ChangeWithDiff, ProviderConfig, Repository, StatusType } from "../type";

class GitContext {

  static async getAllChanges(repo: Repository): Promise<Change[]> {
    const stagedChanges = repo.state.indexChanges;
    const workingTreeChanges = repo.state.workingTreeChanges;
    const untrackedChanges = repo.state.untrackedChanges;
    const mergeChanges = repo.state.mergeChanges;
    const allChanges = [...stagedChanges, ...workingTreeChanges, ...untrackedChanges, ...mergeChanges];
    return allChanges;
  }

  static async buildChangeWithDiff(changes: Change[], config: ProviderConfig, repo: Repository) {
    const allChangesWithDiff: ChangeWithDiff[] = [];

    const MAX_DIFF_SIZE = config.maxDiffSize ?? 500;

    for (const change of changes) {
      const status = StatusMapper.map(change.status);

      let diff: string | undefined = undefined;

      if (status === 'modified') {
        try {
          const relativePath = path.relative(repo.rootUri.fsPath, change.uri.fsPath);

          diff = await repo.diffWithHEAD(relativePath);

          if (!diff || diff.length === 0) {
            diff = await repo.diffIndexWithHEAD(relativePath);
          }

          if (diff && diff.length > 0) {
            Logger.info(`Generated diff for ${change.uri.path}`, {
              diffLength: diff.length,
              filePath: relativePath,
            });

            if (diff.length > MAX_DIFF_SIZE) {
              diff = diff.substring(0, MAX_DIFF_SIZE) + '\n... (diff truncated)';
            }
          } else {
            Logger.debug(`No diff content for ${change.uri.path}`, {
              reason: 'no modifications found in working tree or staging index',
            });
            diff = '';
          }
        } catch (error) {
          Logger.error(`Error generating diff for ${change.uri.path}`, {
            errorMessage: error instanceof Error ? error.message : String(error),
          });
          diff = '';
        }

        allChangesWithDiff.push({
          uri: change.uri.path,
          status,
          diff: diff || '',
        });

        continue;
      }

      allChangesWithDiff.push({
        uri: change.uri.path,
        status: status as Exclude<StatusType, 'modified'>,
      });
    }

    Logger.info(`Generated diffs for changes. Total changes: ${changes.length}, Changes with diff: ${allChangesWithDiff.filter(c => c.status === 'modified').length}`);

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

    return changeSummaries;
  }

  static async buildPreviousCommits(config: ProviderConfig, repo: Repository): Promise<string> {
    try {
      Logger.info(`Fetching previous commits. Amount: ${config.amountPreviousCommits}`);

      const logs = await repo.log({ maxEntries: config.amountPreviousCommits });

      Logger.info(`Fetched ${logs.length} previous commits.`);

      const previousCommits = logs.map(commit => `- ${commit.message.split('\n')[0]} (${commit.hash.substring(0, 7)})`).join('\n');

      return previousCommits;
    } catch (error) {
      Logger.error(`Error fetching previous commits: ${error}`);

      return `Error fetching previous commits: ${error}`;
    }
  }
}

export default GitContext;
