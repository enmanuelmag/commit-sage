# Commit Sage Quick Start

Get started with AI-powered commit messages in 5 minutes.

## What is Commit Sage?

Tired of writing commit messages? Commit Sage generates clear, descriptive commit messages directly from your git changes using an LLM. Just stage your changes, click a button, and let AI do the work. Supports OpenAI API or free local Ollama instances.

## Quick Setup (Choose One)

### Setup with OpenAI (5 minutes)

1. **Get an API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in
   - Create a new API key in the API keys section
   - Copy it

2. **Configure in VS Code**
   - Press `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux) to open Settings
   - Search for "Commit Sage"
   - Fill in:
     - `commitlint-sage.apiUrl`: `https://api.openai.com`
     - `commitlint-sage.apiType`: `openai`
     - `commitlint-sage.modelId`: `gpt-3.5-turbo`
     - `commitlint-sage.apiKey`: Your API key

3. **Done!** You're ready to generate commit messages.

### Setup with Ollama (Free & Local, 5 minutes)

1. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai) and install
   - Open Terminal and run:
     ```bash
     ollama pull llama2
     ollama serve
     ```

2. **Configure in VS Code**
   - Press `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux) to open Settings
   - Search for "Commit Sage"
   - Fill in:
     - `commitlint-sage.apiUrl`: `http://localhost:11434`
     - `commitlint-sage.apiType`: `ollama`
     - `commitlint-sage.modelId`: `llama2`
     - `commitlint-sage.apiKey`: Leave empty

3. **Done!** Your local AI is ready.

## Your First Commit Message

1. **Stage Changes**
   - Open the Source Control panel (Ctrl+Shift+G)
   - Stage the files you want to commit

2. **Generate Message**
   - Look at the Source Control panel title bar
   - Click the sparkle icon (✨)
   - Wait a moment for the message to generate

3. **Commit**
   - Review the generated message in the commit input box
   - Edit it if you want
   - Click the checkmark or press Ctrl+Enter to commit

## Customization Tips

Want to tweak behavior? Check the full [README.md](./README.md) for all configuration options:

- **More creative messages**: Increase `temperature` (default: 0.15)
- **Better style consistency**: Increase `amountPreviousCommits` (default: 3)
- **Shorter/longer messages**: Adjust `maxNewTokens` (default: 256)
- **Better commitlint compliance**: Increase `commitlintMaxRetries` (default: 3)

## Troubleshooting

### "Failed to connect to API"

- Check your `commitlint-sage.apiUrl` is correct
- For OpenAI: `https://api.openai.com`
- For Ollama: `http://localhost:11434` and make sure `ollama serve` is running

### "Invalid API Key"

- OpenAI: Create a new key at [platform.openai.com/api_keys](https://platform.openai.com/api_keys)
- Reload VS Code after updating the key
- Ensure your account has billing enabled

### "Model not found"

- OpenAI: Use a model that exists (gpt-3.5-turbo, gpt-4, etc.)
- Ollama: Run `ollama pull llama2` (or your model) first

For more help, see the [Troubleshooting section](./README.md#troubleshooting) in the full README.

## Learn More

- See the full [README.md](./README.md) for complete documentation
- [Conventional Commits](https://www.conventionalcommits.org) — the standard Commit Sage follows
- [Commitlint](https://commitlint.js.org) — how validation works
- [OpenAI Docs](https://platform.openai.com/docs) — for OpenAI setup
- [Ollama Docs](https://ollama.ai) — for local LLM setup
