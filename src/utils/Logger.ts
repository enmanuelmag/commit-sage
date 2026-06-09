import * as vscode from 'vscode';

type LogContext = {
  [key: string]: any;
};

class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel | null = null;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  static initialize(outputChannel: vscode.OutputChannel): void {
    Logger.getInstance().outputChannel = outputChannel;
  }

  static info(message: string, context?: LogContext): void {
    Logger.getInstance().log('[info]', message, context);
  }

  static error(message: string, context?: LogContext): void {
    Logger.getInstance().log('[error]', message, context);
  }

  static debug(message: string, context?: LogContext): void {
    Logger.getInstance().log('[debug]', message, context);
  }

  static warn(message: string, context?: LogContext): void {
    Logger.getInstance().log('[warn]', message, context);
  }

  private log(level: string, message: string, context?: LogContext): void {
    if (this.outputChannel) {
      let logMessage = `${level} ${message}`;

      if (context && Object.keys(context).length > 0) {
        const contextStr = Object.entries(context)
          .map(([key, value]) => {
            if (typeof value === 'object') {
              return `${key}=${JSON.stringify(value)}`;
            }
            return `${key}=${value}`;
          })
          .join(' | ');
        logMessage += ` {${contextStr}}`;
      }

      this.outputChannel.appendLine(logMessage);
    }
  }
}

export default Logger;
