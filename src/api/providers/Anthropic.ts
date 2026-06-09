import Logger from "../../utils/Logger";
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

  buildRequest(prompt: string, providerConfig: ProviderConfig, systemPrompt: string): RequestInit {
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
          system: systemPrompt,
          max_tokens: maxNewTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      };
    } catch (error) {
      throw new Error(`Error building Anthropic request: ${error}`);
    }
  }

  async generateCommitMessage(prompt: string, providerConfig: ProviderConfig, repoPath?: string): Promise<string> {
    const systemPrompt = await PromptBuilder.getSystemPrompt(repoPath);

    const base = new URL(providerConfig.apiUrl);
    base.pathname = base.pathname.replace(/\/$/, '') + '/v1/messages';
    const url = base.toString();

    const response = await fetch(url, this.buildRequest(prompt, providerConfig, systemPrompt));

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    try {
      const data = await response.json();

      const commitMessage = data.content[0].text.trim();

      Logger.info('Anthropic response generated', {
        messageLength: commitMessage.length,
        model: providerConfig.modelId
      });

      return commitMessage;
    } catch (error) {
      throw new Error(`Error parsing Anthropic response: ${error}`);
    }
  }
}

export default AnthropicProvider;
