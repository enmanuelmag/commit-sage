import { OutputChannel } from "vscode";

import PromptBuilder from "../PromptBuilder";

import { IProvider } from "./IProvider";
import { ProviderConfig } from "../../type";

class AnthropicProvider implements IProvider {
  private static instance: AnthropicProvider;

  private constructor() { }

  static getInstance(): IProvider {
    if (!AnthropicProvider.instance) {
      AnthropicProvider.instance = new AnthropicProvider();
    }
    return AnthropicProvider.instance;
  }

  buildRequest(prompt: string, providerConfig: ProviderConfig): RequestInit {
    const { apiKey, modelId, maxNewTokens, temperature } = providerConfig;

    try {
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          temperature,
          system: PromptBuilder.getSystemPrompt(),
          max_tokens: maxNewTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      };
    } catch (error) {
      throw new Error(`Error building Anthropic request: ${error}`);
    }
  }

  async generateCommitMessage(prompt: string, providerConfig: ProviderConfig, output: OutputChannel): Promise<string> {
    const base = new URL(providerConfig.apiUrl);
    base.pathname = base.pathname.replace(/\/$/, '') + '/v1/messages';
    const url = base.toString();

    const response = await fetch(url, this.buildRequest(prompt, providerConfig));

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    try {
      const data = await response.json();

      const commitMessage = data.content[0].text.trim();

      output.appendLine(`Anthropic raw response: ${commitMessage.length}`);

      return commitMessage;
    } catch (error) {
      throw new Error(`Error parsing Anthropic response: ${error}`);
    }
  }
}

export default AnthropicProvider;
