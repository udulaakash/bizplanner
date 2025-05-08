// 'use server'
'use server';

/**
 * @fileOverview This flow suggests alternative tools and software for a given task or stage in a business plan.
 *
 * - suggestAlternativeTools - A function that suggests alternative tools.
 * - SuggestAlternativeToolsInput - The input type for the suggestAlternativeTools function.
 * - SuggestAlternativeToolsOutput - The return type for the suggestAlternativeTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeToolsInputSchema = z.object({
  task: z.string().describe('The task or stage in the business plan.'),
  currentTool: z.string().describe('The currently suggested tool or software.'),
  businessIdea: z.string().describe('The business idea for which the plan is being generated.'),
});
export type SuggestAlternativeToolsInput = z.infer<typeof SuggestAlternativeToolsInputSchema>;

const SuggestAlternativeToolsOutputSchema = z.object({
  alternatives: z.array(
    z.object({
      toolName: z.string().describe('The name of the alternative tool or software.'),
      reason: z.string().describe('The reason why this tool is a good alternative.'),
    })
  ).describe('An array of alternative tools or software options.'),
});
export type SuggestAlternativeToolsOutput = z.infer<typeof SuggestAlternativeToolsOutputSchema>;

export async function suggestAlternativeTools(input: SuggestAlternativeToolsInput): Promise<SuggestAlternativeToolsOutput> {
  return suggestAlternativeToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeToolsPrompt',
  input: {schema: SuggestAlternativeToolsInputSchema},
  output: {schema: SuggestAlternativeToolsOutputSchema},
  prompt: `You are a business consultant who suggests alternative tools and software for business tasks.

  The user is not satisfied with the current tool suggestion for the task and wants you to suggest alternatives.
  The business idea is: {{{businessIdea}}}
  The task is: {{{task}}}
  The current tool is: {{{currentTool}}}

  Suggest at least 3 alternative tools or software options for the task. For each tool, provide a brief reason why it's a good alternative.

  Format your response as a JSON object with an array of alternatives. Each alternative should have a toolName and a reason field.
  `,
});

const suggestAlternativeToolsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeToolsFlow',
    inputSchema: SuggestAlternativeToolsInputSchema,
    outputSchema: SuggestAlternativeToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
