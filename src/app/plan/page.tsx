"use client";

import { PlanDisplay } from '@/components/biz-plan/PlanDisplay';
import { usePlan } from '@/contexts/PlanContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PlanPage() {
  const { plan, isLoading, error, businessIdea } = usePlan();

  if (isLoading && !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Generating your business plan for "{businessIdea}"...</p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Plan</AlertTitle>
          <AlertDescription>
            We encountered an issue while generating your business plan: {error}
            <br />
            Please try again or refine your business idea.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    );
  }
  
  if (!plan) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6">
        <Alert className="max-w-lg">
           <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Plan Found</AlertTitle>
          <AlertDescription>
            It seems no business plan has been generated yet. Please go back and describe your business idea.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/">Create a Plan</Link>
        </Button>
      </div>
    );
  }

  return <PlanDisplay />;
}
