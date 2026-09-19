type WebMcpTool = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>;
};

type WebMcpContext = {
  registerTool(
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ): Promise<unknown>;
};

interface Document {
  modelContext?: WebMcpContext;
}

interface Navigator {
  modelContext?: WebMcpContext;
}
