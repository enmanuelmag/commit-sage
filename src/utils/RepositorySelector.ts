import { Repository, API } from '../type';
import * as vscode from 'vscode';
import Logger from './Logger';

export class RepositorySelector {

	static async selectRepository(
		repositories: Repository[],
		git: API
	): Promise<Repository | undefined> {
		Logger.debug('Selecting repository from multiple options', {
			availableRepos: repositories.length,
		});

		// Strategy 1: Active editor's file path
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && git.getRepository) {
			const fileUri = activeEditor.document.uri;
			const repoFromFile = git.getRepository(fileUri);
			if (repoFromFile) {
				Logger.info('Selected repository from active editor', {
					repo: repoFromFile.rootUri.path,
				});
				return repoFromFile;
			}
		}

		// Strategy 2: Repository UI selection
		const selectedRepo = repositories.find(repo => repo.ui.selected);
		if (selectedRepo) {
			Logger.info('Selected repository from UI selection', {
				repo: selectedRepo.rootUri.path,
			});
			return selectedRepo;
		}

		// Strategy 3: Single repository
		if (repositories.length === 1) {
			Logger.debug('Only one repository available, using it');
			return repositories[0];
		}

		// Strategy 4: Multiple repositories - ask user
		if (repositories.length > 1) {
			const selected = await vscode.window.showQuickPick(
				repositories.map((repo, index) => ({
					label: repo.rootUri.path.split('/').pop() || `Repo ${index}`,
					description: repo.rootUri.fsPath,
					repo,
				})),
				{
					placeHolder: 'Multiple repositories found. Select one to generate commit message.',
					canPickMany: false,
				}
			);

			if (selected) {
				Logger.info('User selected repository from quick pick', {
					repo: selected.repo.rootUri.path,
				});
				return selected.repo;
			} else {
				Logger.warn('User cancelled repository selection');
				return undefined;
			}
		}

		Logger.error('No repositories available');

		return undefined;
	}
}
