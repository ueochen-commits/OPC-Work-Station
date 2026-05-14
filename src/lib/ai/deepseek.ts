import OpenAI from "openai";

export function hasDeepseekConfig() {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

export async function callDeepseekJson<T>(params: {
  systemPrompt: string;
  userMessage: string;
  model?: "deepseek-chat" | "deepseek-reasoner";
  temperature?: number;
  maxTokens?: number;
}): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"
  });

  const completion = await client.chat.completions.create({
    model: params.model ?? "deepseek-chat",
    messages: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userMessage }
    ],
    temperature: params.temperature ?? 0.1,
    max_tokens: params.maxTokens ?? 700,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("DeepSeek returned empty content");
  }

  return JSON.parse(content) as T;
}
