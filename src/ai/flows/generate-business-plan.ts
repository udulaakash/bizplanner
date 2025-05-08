// src/ai/flows/generate-business-plan.ts
'use server';
/**
 * @fileOverview Generates a comprehensive business plan, including name suggestions, legal structure options, and tool recommendations.
 *
 * - generateBusinessPlan - A function that generates the business plan.
 * - GenerateBusinessPlanInput - The input type for the generateBusinessPlan function.
 * - GenerateBusinessPlanOutput - The return type for the generateBusinessPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessPlanInputSchema = z.object({
  businessIdea: z
    .string()
    .describe('A brief description of the business idea.'),
});
export type GenerateBusinessPlanInput = z.infer<typeof GenerateBusinessPlanInputSchema>;

const BusinessNameSuggestionSchema = z.object({
  name: z.string().describe('A suggested name for the business.'),
  rationale: z
    .string()
    .describe('The reason why this name is a good fit for the business.'),
});

const LegalStructureSuggestionSchema = z.object({
  structure: z.string().describe('A suggested legal structure for the business.'),
  rationale: z
    .string()
    .describe('The reason why this legal structure is a good fit.'),
});

const ToolRecommendationSchema = z.object({
  useCase: z.string().describe('The specific use case this tool addresses.'),
  toolName: z.string().describe('The name of the recommended tool.'),
  rationale: z
    .string()
    .describe('The reason why this tool is recommended for this use case.'),
});

const GenerateBusinessPlanOutputSchema = z.object({
  businessNameSuggestions: z
    .array(BusinessNameSuggestionSchema)
    .describe('A list of suggested business names.'),
  legalStructureSuggestions: z
    .array(LegalStructureSuggestionSchema)
    .describe('A list of suggested legal structures.'),
  actionPlan: z.string().describe('A detailed, step-by-step action plan.'),
  toolRecommendations: z
    .array(ToolRecommendationSchema)
    .describe('A list of recommended tools and software for various use cases.'),
});
export type GenerateBusinessPlanOutput = z.infer<typeof GenerateBusinessPlanOutputSchema>;

export async function generateBusinessPlan(
  input: GenerateBusinessPlanInput
): Promise<GenerateBusinessPlanOutput> {
  return generateBusinessPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessPlanPrompt',
  input: {schema: GenerateBusinessPlanInputSchema},
  output: {schema: GenerateBusinessPlanOutputSchema},
  prompt: `You are a business consultant expert. Based on the business idea provided by the user, generate a comprehensive business plan.

  Business Idea: {{{businessIdea}}}

  The business plan should include:
  - A list of 3-5 suggested business names, with a brief rationale for each.
  - A list of 2-3 suggested legal structures (e.g., sole proprietorship, LLC, corporation), with a brief rationale for each.
  - A detailed, step-by-step action plan to launch the business.
  - A list of recommended tools and software for various use cases (e.g., accounting, marketing, project management), with a brief rationale for each.

  Ensure that the action plan is specific, measurable, achievable, relevant, and time-bound (SMART). The tool recommendations should be practical and cost-effective for a new business.
  Follow the schema provided carefully, populating all fields with relevant information.
  Remember that you are helping the user to get a quick structured starting point for their new venture.
`,
});

const generateBusinessPlanFlow = ai.defineFlow(
  {
    name: 'generateBusinessPlanFlow',
    inputSchema: GenerateBusinessPlanInputSchema,
    outputSchema: GenerateBusinessPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
