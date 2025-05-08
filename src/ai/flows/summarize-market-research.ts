'use server';
/**
 * @fileOverview Market research summarization AI agent.
 *
 * - summarizeMarketResearch - A function that handles the summarization of market research documents.
 * - SummarizeMarketResearchInput - The input type for the summarizeMarketResearch function.
 * - SummarizeMarketResearchOutput - The return type for the summarizeMarketResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketResearchInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A market research document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  businessPlan: z.string().describe('The business plan to integrate the market data into.'),
});
export type SummarizeMarketResearchInput = z.infer<typeof SummarizeMarketResearchInputSchema>;

const SummarizeMarketResearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the key findings from the market research.'),
  implications: z
    .string()
    .describe('The implications of the market research for the business plan.'),
});
export type SummarizeMarketResearchOutput = z.infer<typeof SummarizeMarketResearchOutputSchema>;

export async function summarizeMarketResearch(
  input: SummarizeMarketResearchInput
): Promise<SummarizeMarketResearchOutput> {
  return summarizeMarketResearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketResearchPrompt',
  input: {schema: SummarizeMarketResearchInputSchema},
  output: {schema: SummarizeMarketResearchOutputSchema},
  prompt: `You are an expert market research analyst. You will summarize the key findings from the market research document and explain the implications for the business plan.

Market Research Document: {{media url=documentDataUri}}

Business Plan: {{{businessPlan}}}`,
});

const summarizeMarketResearchFlow = ai.defineFlow(
  {
    name: 'summarizeMarketResearchFlow',
    inputSchema: SummarizeMarketResearchInputSchema,
    outputSchema: SummarizeMarketResearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
