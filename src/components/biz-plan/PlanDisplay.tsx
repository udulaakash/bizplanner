"use client";

import { usePlan } from '@/contexts/PlanContext';
import { PlanOverviewSection } from './PlanOverviewSection';
import { ActionPlanSection } from './ActionPlanSection';
import { ToolRecommendationsSection } from './ToolRecommendationsSection';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, TrendingUp } from 'lucide-react';

export function PlanDisplay() {
  const { plan } = usePlan();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (plan?.actionSteps) {
      const completedSteps = plan.actionSteps.filter(step => step.completed).length;
      const totalSteps = plan.actionSteps.length;
      setProgress(totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0);
    }
  }, [plan?.actionSteps]);

  if (!plan) {
    // This case should ideally be handled by the page, but as a fallback:
    return <p>No plan data available. Please generate a plan first.</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold flex items-center gap-2 text-primary">
            <TrendingUp className="h-8 w-8" />
            Your Business Blueprint: <span className="text-accent">{plan.businessNameSuggestions[0]?.name || 'Your New Venture'}</span>
          </CardTitle>
           <p className="text-muted-foreground pt-1">
            Based on your idea: "{plan.businessIdea}"
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <span className={`text-sm font-semibold ${progress === 100 ? 'text-green-500' : 'text-accent'}`}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full h-3" />
            {progress === 100 && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-2">
                <CheckCircle className="h-4 w-4" />
                Congratulations! All primary action steps are completed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <PlanOverviewSection />
        <ToolRecommendationsSection />
      </div>
      
      <ActionPlanSection />

    </div>
  );
}
