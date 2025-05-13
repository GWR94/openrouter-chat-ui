export interface FreeModel {
  name: string;
  model: string;
  cost: string;
}

export interface PaidModel extends FreeModel {
  cost: "$" | "$$" | "$$$" | "$$$$";
  average: number;
  thinking?: {
    model: string;
    cost: "$" | "$$" | "$$$" | "$$$$";
    average: number;
  };
}

const freeModels: FreeModel[] = [
  {
    name: "DeepSeek R1",
    model: "deepseek/deepseek-r1:free",
    cost: "Free",
  },
  {
    model: "deepseek/deepseek-r1-zero:free",
    name: "DeepSeek R1 Zero",
    cost: "Free",
  },
  {
    name: "DeepSeek V3 0324",
    model: "deepseek/deepseek-chat-v3-0324:free",
    cost: "Free",
  },
  {
    name: "Claude 3.5 Sonnet",
    model: "anthropic/claude-3.5-sonnet:free",
    cost: "Free",
  },
  {
    name: "Gemini Flash 2.0 Experimental",
    model: "google/gemini-2.0-flash-exp:free",
    cost: "Free",
  },
  {
    name: "Microsoft: MAI DS R1",
    model: "microsoft/mai-ds-r1:free",
    cost: "Free",
  },
  {
    name: "Mistral Small 3.1",
    model: "mistralai/mistral-small-3.1-24b-instruct:free",
    cost: "Free",
  },
];

const models: PaidModel[] = [
  {
    name: "DeepSeek R1",
    model: "deepseek/deepseek-r1",
    cost: "$", // The cheapest tier
    average: 2.0, // Relative to a low token usage
  },
  {
    name: "Claude 3.5 Sonnet",
    model: "anthropic/claude-3.5-sonnet",
    cost: "$$$", // Third tier pricing
    average: 30.0, // High token usage
    thinking: {
      model: "anthropic/claude-3.5-sonnet:thinking",
      cost: "$$$",
      average: 35.0,
    },
  },
  {
    name: "DeepSeek V3 0324",
    model: "deepseek/deepseek-chat-v3-0324",
    cost: "$", // The cheapest tier
    average: 2.5, // Low token usage
  },
  {
    name: "Claude 3.7 Sonnet",
    model: "anthropic/claude-3.7-sonnet",
    cost: "$$$$", // Very expensive
    average: 45.0, // High token usage
    thinking: {
      model: "anthropic/claude-3.7-sonnet:thinking",
      cost: "$$$$", // Same as the main model
      average: 50.0, // Very high token usage
    },
  },
  {
    name: "Claude 3.5 Haiku",
    model: "anthropic/claude-3.5-haiku",
    cost: "$", // The cheapest tier
    average: 3.0, // Low token usage
  },
  {
    name: "OpenAI GPT-4.5 Preview",
    model: "openai/gpt-4.5-preview",
    cost: "$$$$", // Very expensive
    average: 50.0, // High token usage
  },
  {
    name: "OpenAI GPT-4.1",
    model: "openai/gpt-4.1",
    cost: "$$$$", // Very expensive
    average: 40.0, // High token usage
  },
  {
    name: "OpenAI GPT-4o",
    model: "openai/gpt-4o-2024-11-20",
    cost: "$$",
    average: 15.0, // Moderate token usage
  },
  {
    name: "OpenAI GPT-4o mini",
    model: "openai/gpt-4o-mini",
    cost: "$",
    average: 5.0, // Low token usage
  },
  {
    name: "OpenAI o3-mini",
    model: "openai/3o-mini",
    cost: "$",
    average: 3.0, // Low token usage
  },
  {
    name: "OpenAI GPT-4 Turbo",
    model: "openai/gpt-4-turbo",
    cost: "$$",
    average: 20.0, // Moderate token usage
  },
  {
    name: "Mistral Codestral",
    model: "mistralai/codestral-2501",
    cost: "$$",
    average: 12.0, // Moderate token usage
  },
  {
    name: "Gemini 2.5 Pro",
    model: "google/gemini-2.5-pro-preview-03-25",
    cost: "$",
    average: 10.0, // Moderate token usage
  },
  {
    name: "Gemini 2.0 Flash",
    model: "google/gemini-2.0-flash-001",
    cost: "$",
    average: 4.0, // Low token usage
  },
  {
    name: "Gemini 2.5 Flash Preview",
    model: "google/gemini-2.5-flash-preview",
    cost: "$",
    average: 6.0, // Low token usage
  },
  {
    name: "DeepSeek Coder",
    model: "deepseek-ai/deepseek-coder",
    cost: "$",
    average: 8.0, // Moderate token usage
  },
  {
    name: "DeepSeek Coder Pro",
    model: "deepseek-ai/deepseek-coder-pro",
    cost: "$$",
    average: 15.0, // High token usage
  },
  {
    name: "DeepSeek Coder Pro+",
    model: "deepseek-ai/deepseek-coder-pro-plus",
    cost: "$$$", // Very expensive
    average: 25.0, // High token usage
  },
];

export { models, freeModels };
