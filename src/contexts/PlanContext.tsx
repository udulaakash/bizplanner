"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateBusinessPlan, type GenerateBusinessPlanOutput, type ToolRecommendationSchema as AIToolRecommendationSchema } from '@/ai/flows/generate-business-plan';
import { suggestAlternativeTools, type SuggestAlternativeToolsInput, type SuggestAlternativeToolsOutput } from '@/ai/flows/suggest-alternative-tools';
import { useToast } from '@/hooks/use-toast';

export interface ActionStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface ToolRecommendationItem extends AIToolRecommendationSchema {
  id: string; 
}

export interface BusinessPlan extends GenerateBusinessPlanOutput {
  actionSteps: ActionStep[];
  toolRecommendations: ToolRecommendationItem[];
}

export interface PlanState {
  businessIdea: string | null;
  plan: BusinessPlan | null;
  isLoading: boolean;
  error: string | null;
}

interface PlanContextType extends PlanState {
  generatePlan: (idea: string) => Promise<void>;
  updateActionStepCompletion: (stepId: string, completed: boolean) => void;
  updateToolRecommendation: (toolId: string, newToolName: string, newRationale: string) => void;
  fetchAlternativeTools: (tool: ToolRecommendationItem) => Promise<SuggestAlternativeToolsOutput | null>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PlanState>({
    businessIdea: null,
    plan: null,
    isLoading: false,
    error: null,
  });
  const router = useRouter();
  const { toast } = useToast();

  const generatePlan = useCallback(async (idea: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, businessIdea: idea }));
    try {
      const rawPlan = await generateBusinessPlan({ businessIdea: idea });
      
      const actionSteps: ActionStep[] = rawPlan.actionPlan
        .split('\n')
        .map(line => line.trim().replace(/^- /, ''))
        .filter(line => line.length > 0)
        .map(description => ({
          id: crypto.randomUUID(),
          description,
          completed: false,
        }));

      const toolRecommendations: ToolRecommendationItem[] = rawPlan.toolRecommendations.map(tool => ({
        ...tool,
        id: crypto.randomUUID(),
      }));

      const processedPlan: BusinessPlan = {
        ...rawPlan,
        actionSteps,
        toolRecommendations,
      };

      setState(prev => ({ ...prev, plan: processedPlan, isLoading: false }));
      router.push('/plan');
    } catch (err) {
      console.error("Error generating plan:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate business plan.';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  }, [router, toast]);

  const updateActionStepCompletion = useCallback((stepId: string, completed: boolean) => {
    setState(prev => {
      if (!prev.plan) return prev;
      const updatedActionSteps = prev.plan.actionSteps.map(step =>
        step.id === stepId ? { ...step, completed } : step
      );
      return { ...prev, plan: { ...prev.plan, actionSteps: updatedActionSteps } };
    });
  }, []);

  const updateToolRecommendation = useCallback((toolId: string, newToolName: string, newRationale: string) => {
    setState(prev => {
      if (!prev.plan) return prev;
      const updatedTools = prev.plan.toolRecommendations.map(tool =>
        tool.id === toolId ? { ...tool, toolName: newToolName, rationale: newRationale } : tool
      );
      return { ...prev, plan: { ...prev.plan, toolRecommendations: updatedTools }};
    });
     toast({
        title: "Tool Updated",
        description: `Tool recommendation changed to ${newToolName}.`,
      });
  }, [toast]);

  const fetchAlternativeTools = useCallback(async (tool: ToolRecommendationItem): Promise<SuggestAlternativeToolsOutput | null> => {
    if (!state.businessIdea) {
      toast({ variant: "destructive", title: "Error", description: "Business idea not found." });
      return null;
    }
    setState(prev => ({...prev, isLoading: true}));
    try {
      const input: SuggestAlternativeToolsInput = {
        task: tool.useCase,
        currentTool: tool.toolName,
        businessIdea: state.businessIdea,
      };
      const alternatives = await suggestAlternativeTools(input);
      setState(prev => ({...prev, isLoading: false}));
      return alternatives;
    } catch (err) {
      console.error("Error fetching alternative tools:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to suggest alternative tools.';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return null;
    }
  }, [state.businessIdea, toast]);


  return (
    <PlanContext.Provider value={{ ...state, generatePlan, updateActionStepCompletion, updateToolRecommendation, fetchAlternativeTools }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
