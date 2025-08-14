/**
 * Grand Prompt for AI Model Enhancement
 * Based on OpenAI's comprehensive prompt engineering guidelines
 */

export const GRAND_PROMPT_TEMPLATE = `You are an expert prompt engineer specializing in {MODEL_NAME}. Your task is to transform the user's original prompt into a clear, specific, and effective version that will produce better results.

Take the original prompt: "{ORIGINAL_PROMPT}"

Transform it by:

1. Adding a clear role or identity for the AI (e.g., "You are a professional web developer...")
2. Making the request more specific and detailed
3. Specifying the desired output format and style
4. Adding relevant context or constraints
5. Including quality requirements or success criteria

{MODEL_SPECIFIC_INSTRUCTIONS}

IMPORTANT: Provide ONLY the enhanced prompt. Do not include any introductory text, explanations, or preambles like "Here's an enhanced prompt" or similar phrases. Start directly with the enhanced prompt content.

Create an enhanced version that is clear, direct, and optimized for {MODEL_NAME}. Write it as natural, flowing text without excessive formatting, XML tags, or complex markdown structure. Keep it professional but conversational.

The enhanced prompt should be significantly more detailed and specific than the original, but still easy to read and understand.`;

export const MODEL_SPECIFIC_INSTRUCTIONS = {
  'ChatGPT': `For ChatGPT, focus on conversational flow and step-by-step reasoning. ChatGPT works best with clear role definitions and moderate complexity. Include specific examples when helpful and set clear boundaries to prevent overly verbose responses.`,

  'Claude': `For Claude, apply these specific optimization techniques:

1. BE EXPLICIT AND DIRECT: Claude 4 responds best to clear, explicit instructions. Be specific about desired output and request "above and beyond" behavior explicitly if needed.

2. PROVIDE CONTEXT AND MOTIVATION: Explain WHY certain behaviors are important. Claude generalizes well from explanations rather than just rules.

3. USE XML TAGS FOR STRUCTURE: Structure complex prompts with XML tags like <instructions>, <context>, <examples>, and <output_format> to help Claude parse different sections accurately.

4. TELL CLAUDE WHAT TO DO (not what not to do): Instead of "Don't use markdown," say "Write in smoothly flowing prose paragraphs."

5. LEVERAGE THINKING CAPABILITIES: For complex reasoning, encourage Claude to think through problems step-by-step before responding.

6. BE VIGILANT WITH EXAMPLES: Claude pays close attention to examples and details. Ensure examples align with desired behaviors.

7. MATCH PROMPT STYLE TO OUTPUT: The formatting style in your prompt influences Claude's response style.

Apply these principles to create a well-structured, explicit prompt that leverages Claude's analytical strengths and systematic approach.`,

  'Gemini': `For Gemini, emphasize creative synthesis and technical precision. Gemini handles complex technical concepts well and excels at connecting diverse knowledge domains. Provide rich context and allow for flexible, innovative approaches.`

};

export const getModelSpecificInstructions = (model: string): string => {
  return MODEL_SPECIFIC_INSTRUCTIONS[model as keyof typeof MODEL_SPECIFIC_INSTRUCTIONS] || MODEL_SPECIFIC_INSTRUCTIONS['ChatGPT'];
};

export const buildGrandPrompt = (originalPrompt: string, selectedModel: string): string => {
  return GRAND_PROMPT_TEMPLATE
    .replace(/{MODEL_NAME}/g, selectedModel)
    .replace(/{MODEL_SPECIFIC_INSTRUCTIONS}/g, getModelSpecificInstructions(selectedModel))
    .replace(/{ORIGINAL_PROMPT}/g, originalPrompt);
};