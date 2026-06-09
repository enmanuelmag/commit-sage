# Commit Sage

AI-powered commit message generator using local/remote LLMs that respects your commitlint rules and project conventions.

Tired of writing commit messages? Commit Sage generates clear, descriptive commit messages directly from your git diff using your favorite LLM—whether that's OpenAI's GPT models or a locally-running Ollama instance.

## Features

- **AI-Powered Generation**: Automatically generate commit messages from your staged changes
- **Multi-Backend Support**: Works with OpenAI API or local Ollama instances
- **Commitlint Validation**: Validates generated messages against your project's commitlint rules with automatic refinement (up to 3 retries by default)
- **Context-Aware**: Includes previous commits as context for consistent messaging style
- **Project-Aware**: Respects your project's commitlint configuration and conventional commit rules
- **One-Click Access**: Integrated directly into VS Code's Source Control menu
- **Instant Insertion**: Generated message automatically populates the commit input box

## Requirements

- **VS Code** version 1.120.0 or higher
- **Git Extension** (built-in to VS Code)
- **One of the following LLM APIs**:
  - **OpenAI**: An API key from [OpenAI Platform](https://platform.openai.com)
  - **Ollama**: A free, local LLM runtime from [Ollama](https://ollama.ai)
- **Optional**: commitlint configuration file in your repository (`.commitlintrc` or similar)

## Installation

Install Commit Sage directly from the [VS Code Marketplace](https://marketplace.visualstudio.com).

## Extension Settings

This extension contributes the following configuration options (all prefixed with `commitlint-sage.`):

| Setting | Type | Default | Required | Description |
|---------|------|---------|----------|-------------|
| `apiUrl` | string | `""` | Yes | The base URL of your LLM API endpoint (without pathname). Examples: `https://api.openai.com` or `http://localhost:11434` |
| `modelId` | string | `""` | Yes | The model ID to use (e.g., `gpt-3.5-turbo` for OpenAI, `llama2` for Ollama) |
| `apiType` | enum | `openai` | No | API backend type: `openai` or `ollama` |
| `apiKey` | string | `""` | For OpenAI | API token/key for authentication (required for OpenAI, not used for Ollama) |
| `amountPreviousCommits` | number | `3` | No | Number of previous commits to include as context (helps maintain consistent style) |
| `maxDiffSize` | number | `500` | No | Maximum diff size (in lines) to include in the prompt |
| `maxNewTokens` | number | `256` | No | Maximum number of tokens the LLM should generate |
| `temperature` | number | `0.15` | No | Sampling temperature (0.0-1.0: lower = more deterministic, higher = more creative) |
| `commitlintMaxRetries` | number | `3` | No | Maximum refinement attempts to satisfy commitlint rules (1-10) |

## Getting Started

### Option 1: OpenAI

1. **Get an API Key**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Sign up or log in to your account
   - Navigate to API keys and create a new secret key
   - Copy your API key

2. **Configure Commit Sage**
   - Open VS Code Settings (Cmd+, on macOS or Ctrl+, on Windows/Linux)
   - Search for "Commit Sage"
   - Set the following:
     - `commitlint-sage.apiUrl`: `https://api.openai.com`
     - `commitlint-sage.apiType`: `openai`
     - `commitlint-sage.modelId`: `gpt-3.5-turbo` (or `gpt-4` if you have access)
     - `commitlint-sage.apiKey`: Paste your API key here

3. **Start Generating**
   - Open the Source Control panel (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on macOS)
   - Stage your changes
   - Click the sparkle icon (✨) in the SCM title menu
   - Review the generated message and adjust if needed
   - Commit as normal

**Cost Note**: OpenAI API usage is charged per token. Monitor your usage at [platform.openai.com/account/usage](https://platform.openai.com/account/usage).

### Option 2: Ollama (Local & Free)

1. **Install and Run Ollama**
   - Download Ollama from [ollama.ai](https://ollama.ai)
   - Install and launch the application
   - Open a terminal and run:
     ```bash
     ollama pull llama2  # or your preferred model
     ollama serve
     ```
   - Ollama will start the API server on `http://localhost:11434`

2. **Configure Commit Sage**
   - Open VS Code Settings (Cmd+, on macOS or Ctrl+, on Windows/Linux)
   - Search for "Commit Sage"
   - Set the following:
     - `commitlint-sage.apiUrl`: `http://localhost:11434`
     - `commitlint-sage.apiType`: `ollama`
     - `commitlint-sage.modelId`: `llama2` (or whatever model you pulled)
     - `commitlint-sage.apiKey`: Leave empty (not required for Ollama)

3. **Start Generating**
   - Open the Source Control panel (Ctrl+Shift+G on Windows/Linux, Cmd+Shift+G on macOS)
   - Stage your changes
   - Click the sparkle icon (✨) in the SCM title menu
   - Review the generated message and adjust if needed
   - Commit as normal

**Advantages**: Free, runs entirely locally, respects your privacy, no API costs.

### Option 3: Other Local Hosting Platforms

Beyond Ollama, several other local LLM hosting platforms provide OpenAI-compatible APIs. These all use `apiType: openai` in your Commit Sage configuration.

#### LM Studio

A user-friendly GUI application for running LLMs locally with zero command-line knowledge required.

**Website**: [lmstudio.ai](https://lmstudio.ai)

**Default Endpoint**: `http://localhost:1234`

1. **Install and Run LM Studio**
   - Download from [lmstudio.ai](https://lmstudio.ai)
   - Install and launch the application
   - Browse the built-in model library and select a model
   - Click "Load Model" and wait for it to download
   - LM Studio automatically starts the API server

2. **Configure Commit Sage**
   - Open VS Code Settings (Cmd+, on macOS or Ctrl+, on Windows/Linux)
   - Search for "Commit Sage"
   - Set the following:
     ```json
     {
       "commitlint-sage.apiUrl": "http://localhost:1234",
       "commitlint-sage.apiType": "openai",
       "commitlint-sage.modelId": "your-model-id",
       "commitlint-sage.apiKey": ""
     }
     ```
   - Note: Use the exact model id shown in LM Studio's UI (visible in the model selector)

3. **Verify the Connection**
   ```bash
   curl http://localhost:1234/v1/models
   ```
   This should return a list of available models.

**Advantages**: GUI-first (no terminal required), large model library, one-click setup, resource monitoring dashboard, cross-platform (Windows, macOS, Linux).

#### Text Generation WebUI (oobabooga)

A feature-rich Python-based web interface for advanced users who want maximum customization.

**Repository**: [github.com/oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)

**Default Endpoint**: `http://localhost:5000`

1. **Install and Run Text Generation WebUI**
   - Clone the repository: `git clone https://github.com/oobabooga/text-generation-webui.git`
   - Navigate to the directory: `cd text-generation-webui`
   - Start the server with OpenAI API support: `python server.py --listen --api`
   - On first run, the script will download required dependencies
   - The API server will be available at `http://localhost:5000`

2. **Configure Commit Sage**
   - Open VS Code Settings (Cmd+, on macOS or Ctrl+, on Windows/Linux)
   - Search for "Commit Sage"
   - Set the following:
     ```json
     {
       "commitlint-sage.apiUrl": "http://localhost:5000",
       "commitlint-sage.apiType": "openai",
       "commitlint-sage.modelId": "your-loaded-model-name",
       "commitlint-sage.apiKey": ""
     }
     ```

3. **Verify the Connection**
   ```bash
   curl http://localhost:5000/v1/models
   ```
   This should return a list of available models.

**Important**: The OpenAI API extension must be explicitly enabled. When you run the server with `--api` flag, it automatically loads this extension.

**Advantages**: Highly customizable, advanced model management, supports fine-tuning, large community, active development.

**Best For**: Power users who want fine-grained control and customization options.

#### vLLM

A high-performance inference engine optimized for GPU execution, ideal for production use and maximum throughput.

**Documentation**: [docs.vllm.ai](https://docs.vllm.ai)

**Default Endpoint**: `http://localhost:8000`

1. **Install and Run vLLM**
   - Install vLLM: `pip install vllm`
   - Start the API server with your chosen model (replace with HuggingFace model ID):
     ```bash
     python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-2-7b-hf
     ```
   - The API server will be available at `http://localhost:8000`

2. **Configure Commit Sage**
   - Open VS Code Settings (Cmd+, on macOS or Ctrl+, on Windows/Linux)
   - Search for "Commit Sage"
   - Set the following:
     ```json
     {
       "commitlint-sage.apiUrl": "http://localhost:8000",
       "commitlint-sage.apiType": "openai",
       "commitlint-sage.modelId": "your-huggingface-model-id",
       "commitlint-sage.apiKey": ""
     }
     ```
   - Use the same HuggingFace model ID you passed to the startup command

3. **Verify the Connection**
   ```bash
   curl http://localhost:8000/v1/models
   ```
   This should return a list of available models.

**Port Conflict Note**: vLLM defaults to port 8000, which conflicts with LM Studio. If running both, change vLLM's port using the `--port` flag:
```bash
python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-2-7b-hf --port 8001
```
Then use `http://localhost:8001` in your Commit Sage configuration.

**Advantages**: Production-ready, highest performance, excellent GPU optimization, well-documented API, perfect for power users.

**Best For**: Users with GPU hardware who prioritize performance and need production-grade inference.

#### Configuration Summary

All local hosting platforms in this section share a common configuration pattern:

- `commitlint-sage.apiType`: **Always use `openai`** (unlike Ollama which uses `ollama`)
- `commitlint-sage.apiKey`: Leave empty (no authentication needed for local services)
- `commitlint-sage.apiUrl`: Use the platform's default endpoint (or custom port if modified)
- `commitlint-sage.modelId`: Use the exact model name/ID from your platform

To test any platform's endpoint, use:
```bash
curl http://localhost:PORT/v1/models
```

## Usage

### Generate a Commit Message

1. Stage your changes in the Source Control panel
2. Open the Source Control panel if not already visible (Ctrl+Shift+G)
3. Click the sparkle icon (✨) in the SCM title bar
4. Wait for the message to be generated (you'll see a notification)
5. The generated message will appear in the commit input box
6. Review the message, edit if needed, and commit normally

### Customize Behavior

Adjust these settings in VS Code to fine-tune generation:

- **More creative messages**: Increase `temperature` (e.g., 0.3-0.5)
- **More consistent style**: Increase `amountPreviousCommits` (e.g., 5-10)
- **Shorter diffs**: Decrease `maxDiffSize`
- **More detailed messages**: Increase `maxNewTokens`
- **Better commitlint compliance**: Increase `commitlintMaxRetries`

## Troubleshooting

### API Connection Failed

**Problem**: "Failed to connect to API" error

**Solutions**:
- Verify `commitlint-sage.apiUrl` is correct:
  - OpenAI: `https://api.openai.com`
  - Ollama: `http://localhost:11434`
- Ensure Ollama is running: `ollama serve` in a terminal
- Check your network connection
- Verify the API endpoint is accessible

### Invalid API Key

**Problem**: "Invalid API key" or "Unauthorized" error

**Solutions** (OpenAI):
- Go to [platform.openai.com/api_keys](https://platform.openai.com/api_keys)
- Create a new API key (old keys may have expired)
- Paste the new key into `commitlint-sage.apiKey`
- Reload VS Code (Cmd+R on macOS, Ctrl+R on Windows/Linux)
- Ensure your API key has billing enabled

### Invalid Model ID

**Problem**: "Model not found" or similar error

**Solutions**:
- **OpenAI**: Verify model exists (gpt-3.5-turbo, gpt-4, etc.)
- **Ollama**: Run `ollama pull <model>` to download the model first
- Check model availability at [platform.openai.com/docs/models](https://platform.openai.com/docs/models) for OpenAI
- Run `ollama list` to see available local models

### Commitlint Validation Keeps Failing

**Problem**: Generated message fails commitlint rules repeatedly

**Solutions**:
- Increase `commitlint-sage.commitlintMaxRetries` (up to 10)
- Check your commitlint configuration file (`.commitlintrc` or similar)
- Review the rules your project enforces
- Manually adjust the generated message to match your rules
- Consider relaxing strict rules if they're too restrictive

### Message Seems Low Quality or Irrelevant

**Problem**: Generated messages are generic or miss important details

**Solutions**:
- Increase `commitlint-sage.amountPreviousCommits` to provide more context
- Try a different model (gpt-4 over gpt-3.5-turbo for better quality)
- Increase `commitlint-sage.temperature` slightly for more variety
- Ensure you're staging all relevant changes
- Manual messages are always an option—Commit Sage is here to help, not force

### Ollama Server Not Found

**Problem**: "Connection refused" when using Ollama

**Solutions**:
- Run `ollama serve` in a terminal to start the server
- Verify it's running: `curl http://localhost:11434/api/tags`
- Ensure `commitlint-sage.apiUrl` is exactly `http://localhost:11434`
- Check firewall settings aren't blocking local connections

## Known Issues

- If your project has very strict or unusual commitlint rules, refinement attempts may still fail. In these cases, the original generated message is used.
- Temperature and token settings take effect after reloading VS Code
- Very large diffs (>500 lines) are truncated to avoid token limits

## Release Notes

### 0.0.1

Initial release of Commit Sage:
- AI-powered commit message generation using OpenAI and Ollama
- Commitlint validation with automatic refinement
- Previous commit context awareness
- Direct integration with VS Code Source Control panel

---

## Contributing

For issues, feature requests, or contributions, visit the [Commit Sage repository](https://github.com/enmanuelmag/commitlint-sage).

## License

See LICENSE file for details.

## Resources

- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Commitlint Documentation](https://commitlint.js.org)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Ollama Documentation](https://ollama.ai)
