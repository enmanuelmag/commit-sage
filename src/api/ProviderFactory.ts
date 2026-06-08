import { ApiType } from "../type";
import AnthropicProvider from "./providers/Anthropic";
import { IProvider } from "./providers/IProvider";
import Ollama from "./providers/Ollama";
import OpenAI from "./providers/OpenAI";

class ProviderFactory {
  static createProvider(providerName: ApiType): IProvider {
    switch (providerName) {
      case ApiType.OpenAI:
        return OpenAI.getInstance();
      case ApiType.Anthropic:
        return AnthropicProvider.getInstance();
      case ApiType.Ollama:
        return Ollama.getInstance();
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  }
}

export default ProviderFactory;
