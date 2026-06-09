"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_harness_kit_1 = require("@cardor/agent-harness-kit");
exports.default = (0, agent_harness_kit_1.defineHarness)({
    project: {
        name: "commit-sage",
        description: "A vs code extension to auto fill commit message from a local/remote host LLM API (OpenAI, Ollama, and more)",
        docsPath: './docs',
    },
    provider: 'claude-code',
    agents: {
        lead: { instructionsPath: null },
        explorer: { instructionsPath: null, allowedPaths: ['./docs', './src'] },
        builder: { instructionsPath: null, writablePaths: ['./src', './tests'] },
        reviewer: { instructionsPath: null },
        custom: [],
    },
    // SQLite (default). Switch to postgres/mysql by changing database.type.
    // database: { type: 'postgres', connectionString: process.env.DATABASE_URL },
    // database: { type: 'mysql',    connectionString: process.env.DATABASE_URL },
    database: { type: 'sqlite', path: '.harness/harness.db' },
    storage: {
        dir: '.harness',
        tasks: { adapter: 'local' },
        sections: {
            toolsUsed: true,
            filesModified: true,
            result: true,
            blockers: true,
            nextSteps: false,
        },
        markdownFallback: { enabled: true, path: '.harness/current.md' },
    },
    health: {
        scriptPath: './health.sh',
        required: true,
    },
    tools: {
        mcp: { enabled: true, port: 3742 },
        scripts: { enabled: true, outputDir: './.harness/scripts' },
    },
});
//# sourceMappingURL=agent-harness-kit.config.js.map