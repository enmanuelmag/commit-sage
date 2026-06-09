import * as vscode from 'vscode';
import Logger from './Logger';

export class ErrorHandler {
  static handleError(context: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(`${context}: ${errorMessage}`);
    vscode.window.showErrorMessage(`${context}. Please try again.`);
  }

  static handleWarning(context: string, message: string): void {
    Logger.warn(message);
    vscode.window.showWarningMessage(context);
  }

  static handleConfigError(setting: string): void {
    const message = `${setting} is not configured`;
    Logger.error(message);
    vscode.window.showErrorMessage(`${message}. Please set it in the extension settings.`);
  }

  static handleMissingGit(): void {
    const message = 'Git extension not found or not enabled';
    Logger.error(message);
    vscode.window.showErrorMessage('Git extension not found. Please install the Git extension and try again.');
  }

  static handleNoRepository(): void {
    const message = 'No git repository found';
    Logger.warn(message);
    vscode.window.showWarningMessage('No git repository found. Please open a folder with a git repository.');
  }

  static handleNoChanges(): void {
    Logger.warn('No changes detected');
    vscode.window.showWarningMessage('No changes detected. Please make some changes before generating a commit message.');
  }
}
