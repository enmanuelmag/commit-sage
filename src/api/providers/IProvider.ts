import { ProviderConfig } from "../../type";

export interface IProvider {

  buildRequest(prompt: string, providerConfig: ProviderConfig, systemPrompt: string): any;

  generateCommitMessage(prompt: string, providerConfig: ProviderConfig, repoPath?: string): Promise<string>;
}
