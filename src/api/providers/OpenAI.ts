import Logger from "../../utils/Logger";
import PromptBuilder from "../PromptBuilder";

import { IProvider } from "./IProvider";
import { ProviderConfig } from "../../type";

class OpenAI implements IProvider {
  private static instance: OpenAI;

  private constructor() { }

  static getInstance(): IProvider {
    if (!OpenAI.instance) {
      OpenAI.instance = new OpenAI();
    }
    return OpenAI.instance;
  }

  buildRequest(prompt: string, providerConfig: ProviderConfig, systemPrompt: string): RequestInit {
    const { apiKey, modelId, temperature } = providerConfig;

    try {
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      };
    } catch (error) {
      throw new Error(`Error building OpenAI request: ${error}`);
    }
  }

  async generateCommitMessage(prompt: string, providerConfig: ProviderConfig, repoPath?: string): Promise<string> {
    const systemPrompt = await PromptBuilder.getSystemPrompt(repoPath);

    const base = new URL(providerConfig.apiUrl);
    base.pathname = base.pathname.replace(/\/$/, '') + '/v1/chat/completions';
    const url = base.toString();

    const response = await fetch(url, this.buildRequest(prompt, providerConfig, systemPrompt));

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    try {
      const data = await response.json();

      const commitMessage = data.choices[0].message.content.trim();

      Logger.info('OpenAI response generated', {
        messageLength: commitMessage.length,
        model: providerConfig.modelId
      });

      return commitMessage;
    } catch (error) {
      throw new Error(`Error parsing OpenAI response: ${error}`);
    }
  }
}

export default OpenAI;
