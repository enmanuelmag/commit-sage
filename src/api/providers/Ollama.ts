import { OutputChannel } from "vscode";

import PromptBuilder from "../PromptBuilder";

import { IProvider } from "./IProvider";
import { ProviderConfig } from "../../type";

class Ollama implements IProvider {
  private static instance: Ollama;

  private constructor() { }

  static getInstance(): IProvider {
    if (!Ollama.instance) {
      Ollama.instance = new Ollama();
    }
    return Ollama.instance;
  }

  buildRequest(prompt: string, providerConfig: ProviderConfig): RequestInit {
    const { modelId, maxNewTokens, temperature } = providerConfig;

    try {
      return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelId,
          stream: false,
          options: {
            temperature,
          },
          messages: [
            { role: 'system', content: PromptBuilder.getSystemPrompt() },
            { role: 'user', content: prompt },
          ],
        }),
      };
    } catch (error) {
      throw new Error(`Error building Ollama request: ${error}`);
    }
  }

  async generateCommitMessage(prompt: string, providerConfig: ProviderConfig, output: OutputChannel): Promise<string> {
    const base = new URL(providerConfig.apiUrl);
    base.pathname = base.pathname.replace(/\/$/, '') + '/api/chat';
    const url = base.toString();

    const response = await fetch(url, this.buildRequest(prompt, providerConfig));

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    try {
      const data = await response.json();

      const commitMessage = data.message.content.trim();

      output.appendLine(`Ollama raw response: ${commitMessage.length}`);

      return commitMessage;
    } catch (error) {
      throw new Error(`Error parsing Ollama response: ${error}`);
    }
  }
}

export default Ollama;
