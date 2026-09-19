export function getModelContext() {
  if (typeof document === "undefined") return null;
  const ctx = document.modelContext ?? navigator.modelContext;
  return ctx && "registerTool" in ctx ? ctx : null;
}

export function toolText(text: string) {
  return { content: [{ type: "text" as const, text }] };
}
