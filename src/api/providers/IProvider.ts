import { OutputChannel } from "vscode";
import { ProviderConfig } from "../../type";

export interface IProvider {

  buildRequest(prompt: string, providerConfig: ProviderConfig, output: OutputChannel): any;

  generateCommitMessage(prompt: string, providerConfig: ProviderConfig, output: OutputChannel): Promise<string>;
}
