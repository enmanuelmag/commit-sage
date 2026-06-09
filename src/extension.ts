import * as vscode from 'vscode';

import { getConfig, getCommitLintMaxRetries } from './config';

import Logger from './utils/Logger';
import GitContext from './utils/GitContext';
import { ErrorHandler } from './utils/ErrorHandler';
import { RepositorySelector } from './utils/RepositorySelector';

import { CommitMessageGenerator } from './services/CommitMessageGenerator';

import { GitExtension } from './type';

const executeWithProgress = async <T>(task: () => Promise<T>, title: string): Promise<T> => {
	return new Promise((resolve, reject) => {
		vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				cancellable: false,
				title,
			},
			async () => {
				try {
					const result = await task();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}
		);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel('Commit Sage');

	Logger.initialize(output);

	Logger.info('Commit Sage activated.');

	let isProcessing = false;

	const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;

	if (!gitExtension) {
		Logger.error('Git extension not found.');
		vscode.window.showErrorMessage('Git extension not found. Please install the Git extension and try again.');
		return;
	}

	if (!gitExtension.enabled) {
		Logger.error('Git extension is not enabled.');
		vscode.window.showErrorMessage('Git extension is not enabled. Please enable the Git extension and try again.');
		return;
	}

	const cmd = vscode.commands.registerCommand('commit-sage.generateMessage', async () => {
		if (isProcessing) {
			ErrorHandler.handleWarning('⚠️  Already generating', 'Already generating commit message...');
			output.show();
			return;
		}

		isProcessing = true;

		try {
			await executeWithProgress(async () => {
				const { apiType, providerConfig } = getConfig();

				const git = gitExtension.getAPI(1);
				if (!git) {
					ErrorHandler.handleMissingGit();
					return;
				}

				const repo = await RepositorySelector.selectRepository(
					git.repositories,
					git
				);

				if (!repo) {
					ErrorHandler.handleNoRepository();
					return;
				}

				try {
					const allChanges = await GitContext.getAllChanges(repo);

					const maxRetries = getCommitLintMaxRetries();
					const message = await CommitMessageGenerator.generateAndRefine(
						repo,
						allChanges,
						apiType,
						providerConfig,
						maxRetries
					);

					if (message) {
						repo.inputBox.value = message;
						Logger.info(`Generated Commit Message: ${message}`);
						Logger.info('Commit message set in input box.');
						output.show();
					}
				} catch (error) {
					ErrorHandler.handleError('An unexpected error occurred', error);
				}
			}, 'Generating commit message...');
		} finally {
			isProcessing = false;
		}
	});

	context.subscriptions.push(cmd);
}

// This method is called when your extension is deactivated
export function deactivate() {
}
