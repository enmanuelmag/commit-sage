import * as vscode from 'vscode';

import { getConfig } from './config';

import ProviderFactory from './api/ProviderFactory';
import PromptBuilder from './api/PromptBuilder';

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

	output.appendLine('Commit Sage activated.');

	let isProcessing = false;

	const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;

	if (!gitExtension) {
		output.appendLine('Git extension not found.');
		vscode.window.showErrorMessage('Git extension not found. Please install the Git extension and try again.');
		return;
	}

	if (!gitExtension.enabled) {
		output.appendLine('Git extension is not enabled.');
		vscode.window.showErrorMessage('Git extension is not enabled. Please enable the Git extension and try again.');
		return;
	}

	const cmd = vscode.commands.registerCommand('commit-sage.generateMessage', async () => {
		if (isProcessing) {
			output.appendLine('⚠️  Already generating commit message...');
			vscode.window.showWarningMessage('Already generating commit message...');
			output.show();
			return;
		}

		isProcessing = true;

		try {
			await executeWithProgress(async () => {
				const { apiType, providerConfig } = getConfig();

				output.appendLine(`Using API Type: ${apiType}`);

				let message: string;

				const git = gitExtension.getAPI(1);

				if (!git) {
					output.appendLine('Failed to get Git API.');
					vscode.window.showErrorMessage('Failed to get Git API. Please ensure the Git extension is properly installed and enabled.');
					return;
				}

				const repo = git.repositories[0];

				if (!repo) {
					output.appendLine('No git repository found.');
					vscode.window.showErrorMessage('No git repository found. Please open a folder with a git repository.');
					return;
				}

				try {
					const stagedChanges = repo.state.indexChanges;

					const workingTreeChanges = repo.state.workingTreeChanges;

					const untrackedChanges = repo.state.untrackedChanges;

					const mergeChanges = repo.state.mergeChanges;

					const allChanges = [...stagedChanges, ...workingTreeChanges, ...untrackedChanges, ...mergeChanges];

					if (allChanges.length === 0) {
						output.appendLine('No changes detected in the repository.');
						vscode.window.showWarningMessage('No changes detected in the repository. Please make some changes before generating a commit message.');
						return;
					}

					const provider = ProviderFactory.createProvider(apiType);

					const prompt = await PromptBuilder.buildPrompt(allChanges, providerConfig, repo);

					message = await provider.generateCommitMessage(prompt, providerConfig, output);
				} catch (error) {
					output.appendLine(`${error}`);
					vscode.window.showErrorMessage('Failed to generate commit message. Check output for details.');
					return;
				} finally {
					isProcessing = false;
				}

				if (!message) {
					isProcessing = false;
					output.appendLine('No commit message generated.');
					vscode.window.showWarningMessage('No commit message generated. Check output for details.');
					return;
				}

				output.appendLine(`Generated Commit Message: ${message}`);

				repo.inputBox.value = message;

				output.appendLine('Commit message set in input box.');
				output.show();
			}, 'Generating commit message...');
		} catch (error) { }

		isProcessing = false;
	});

	context.subscriptions.push(cmd);
}

// This method is called when your extension is deactivated
export function deactivate() {
}
