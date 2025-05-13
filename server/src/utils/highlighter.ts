import hljs from "highlight.js";

export interface CodeBlock {
  language: string;
  code: string;
  highlighted: string;
}

export const extractAndHighlightCode = (content: string): string => {
  // Match code blocks with ```language code ``` format
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  return content.replace(codeBlockRegex, (match, language, code) => {
    try {
      const highlighted = language
        ? hljs.highlight(code.trim(), { language }).value
        : hljs.highlightAuto(code.trim()).value;

      return `<pre><code class="hljs language-${
        language || "plaintext"
      }">${highlighted}</code></pre>`;
    } catch (error) {
      console.error(`Error highlighting code for language ${language}:`, error);
      return match; // Return original if highlighting fails
    }
  });
};
