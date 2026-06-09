import * as vscode from 'vscode';

import { ApiType, CommitSageConfig } from "./type";

export const getConfig = (): CommitSageConfig => {
  const config = vscode.workspace.getConfiguration('commit-sage');

  return {
    apiType: config.get('apiType') ?? ApiType.OpenAI,
    providerConfig: {
      apiUrl: config.get('apiUrl') ?? '',
      apiKey: config.get('apiKey') ?? '',
      modelId: config.get('modelId') ?? '',
      maxNewTokens: config.get('maxNewTokens') ?? 256,
      temperature: config.get('temperature') ?? 0.25,
      maxDiffSize: config.get('maxDiffSize') ?? 500,
      amountPreviousCommits: config.get('amountPreviousCommits') ?? 3,
    }
  } satisfies CommitSageConfig;
};
