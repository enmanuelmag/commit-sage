import * as vscode from 'vscode';

import { CommitSageConfig } from "./type";

export const getConfig = (): CommitSageConfig => {
  const config = vscode.workspace.getConfiguration('commit-sage');
  return {
    apiType: config.get('apiType'),
    providerConfig: {
      apiUrl: config.get('apiUrl'),
      apiKey: config.get('apiKey'),
      modelId: config.get('modelId'),
      maxNewTokens: config.get('maxNewTokens'),
      temperature: config.get('temperature'),
      maxDiffSize: config.get('maxDiffSize'),
    }
  } as CommitSageConfig;
};