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
    name: "Claude Opus 4",
    model: "anthropic/claude-opus-4",
    cost: "$$$$", // Most expensive tier - Latest flagship model
    average: 50.0, // Very high cost per request
  },
  {
    name: "Claude Sonnet 4",
    model: "anthropic/claude-sonnet-4",
    cost: "$$$", // High tier
    average: 35.0, // High cost per request
  },
  {
    name: "DeepSeek R1",
    model: "deepseek/deepseek-r1",
    cost: "$$", // Mid tier
    average: 15.0, // Moderate cost per request
  },
  {
    name: "Claude 3.5 Sonnet",
    model: "anthropic/claude-3.5-sonnet",
    cost: "$$$", // High tier
    average: 30.0, // High cost per request
    thinking: {
      model: "anthropic/claude-3.5-sonnet:thinking",
      cost: "$$$",
      average: 32.0,
    },
  },
  {
    name: "DeepSeek V3 0324",
    model: "deepseek/deepseek-chat-v3-0324",
    cost: "$$", // Mid tier
    average: 12.0, // Moderate cost per request
  },
  {
    name: "Claude 3.7 Sonnet",
    model: "anthropic/claude-3.7-sonnet",
    cost: "$$$$", // Most expensive tier
    average: 45.0, // Very high cost per request
    thinking: {
      model: "anthropic/claude-3.7-sonnet:thinking",
      cost: "$$$$",
      average: 47.0, // Slightly higher than base model
    },
  },
  {
    name: "Claude 3.5 Haiku",
    model: "anthropic/claude-3.5-haiku",
    cost: "$$", // Mid tier
    average: 18.0, // Moderate cost per request
  },
  {
    name: "OpenAI GPT-4.5 Preview",
    model: "openai/gpt-4.5-preview",
    cost: "$$$$", // Most expensive tier
    average: 48.0, // Very high cost per request
  },
  {
    name: "OpenAI GPT-4.1",
    model: "openai/gpt-4.1",
    cost: "$$$", // High tier
    average: 35.0, // High cost per request
  },
  {
    name: "OpenAI GPT-4o",
    model: "openai/gpt-4o-2024-11-20",
    cost: "$$$", // High tier
    average: 25.0, // High cost per request
  },
  {
    name: "OpenAI GPT-4o mini",
    model: "openai/gpt-4o-mini",
    cost: "$$", // Mid tier
    average: 15.0, // Moderate cost per request
  },
  {
    name: "OpenAI o3-mini",
    model: "openai/3o-mini",
    cost: "$", // Low tier
    average: 8.0, // Low cost per request
  },
  {
    name: "OpenAI GPT-4 Turbo",
    model: "openai/gpt-4-turbo",
    cost: "$$", // Mid tier
    average: 20.0, // Moderate cost per request
  },
  {
    name: "Mistral Codestral",
    model: "mistralai/codestral-2501",
    cost: "$$", // Mid tier
    average: 12.0, // Moderate cost per request
  },
  {
    name: "Gemini 2.5 Pro",
    model: "google/gemini-2.5-pro-preview-03-25",
    cost: "$$", // Mid tier
    average: 18.0, // Moderate cost per request
  },
  {
    name: "Gemini 2.0 Flash",
    model: "google/gemini-2.0-flash-001",
    cost: "$", // Low tier
    average: 6.0, // Low cost per request
  },
  {
    name: "Gemini 2.5 Flash Preview",
    model: "google/gemini-2.5-flash-preview",
    cost: "$", // Low tier
    average: 8.0, // Low cost per request
  },
  {
    name: "DeepSeek Coder",
    model: "deepseek-ai/deepseek-coder",
    cost: "$", // Low tier
    average: 8.0, // Low cost per request
  },
  {
    name: "DeepSeek Coder Pro",
    model: "deepseek-ai/deepseek-coder-pro",
    cost: "$$", // Mid tier
    average: 15.0, // Moderate cost per request
  },
  {
    name: "DeepSeek Coder Pro+",
    model: "deepseek-ai/deepseek-coder-pro-plus",
    cost: "$$$", // High tier
    average: 25.0, // High cost per request
  },
];

export { models, freeModels };
