"use client";

import { usePlan, type ActionStep } from '@/contexts/PlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ListChecks } from 'lucide-react';

export function ActionPlanSection() {
  const { plan, updateActionStepCompletion } = usePlan();

  if (!plan) return null;

  const handleCheckedChange = (stepId: string, checked: boolean) => {
    updateActionStepCompletion(stepId, checked);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          Action Plan
        </CardTitle>
        <CardDescription>Your step-by-step guide to launching your business. Mark steps as completed to track your progress.</CardDescription>
      </CardHeader>
      <CardContent>
        {plan.actionSteps.length > 0 ? (
          <ul className="space-y-4">
            {plan.actionSteps.map((step: ActionStep) => (
              <li key={step.id} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg transition-all hover:bg-muted">
                <Checkbox
                  id={`step-${step.id}`}
                  checked={step.completed}
                  onCheckedChange={(checked) => handleCheckedChange(step.id, !!checked)}
                  className="mt-1 transform scale-110"
                  aria-labelledby={`label-step-${step.id}`}
                />
                <Label
                  htmlFor={`step-${step.id}`}
                  id={`label-step-${step.id}`}
                  className={`flex-1 text-base ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {step.description}
                </Label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No action steps defined in the plan yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
