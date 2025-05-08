"use client";

import { usePlan } from '@/contexts/PlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Scale } from 'lucide-react';

export function PlanOverviewSection() {
  const { plan } = usePlan();

  if (!plan) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Business Vitals
        </CardTitle>
        <CardDescription>Key identity and structural suggestions for your venture.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Suggested Business Names
          </h3>
          <ul className="space-y-2">
            {plan.businessNameSuggestions.map((suggestion, index) => (
              <li key={index} className="p-3 bg-muted/50 rounded-md">
                <p className="font-medium text-foreground">{suggestion.name}</p>
                <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Scale className="h-5 w-5 text-accent" />
            Legal Structure Options
          </h3>
          <ul className="space-y-2">
            {plan.legalStructureSuggestions.map((suggestion, index) => (
              <li key={index} className="p-3 bg-muted/50 rounded-md">
                <p className="font-medium text-foreground">{suggestion.structure}</p>
                <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
