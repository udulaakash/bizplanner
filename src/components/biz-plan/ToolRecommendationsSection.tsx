"use client";

import React, { useState } from 'react';
import { usePlan, type ToolRecommendationItem } from '@/contexts/PlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Edit3, Loader2, Replace, Settings2, Wand2 } from 'lucide-react';
import type { SuggestAlternativeToolsOutput } from '@/ai/flows/suggest-alternative-tools';

interface EditToolDialogProps {
  tool: ToolRecommendationItem;
  onSave: (toolId: string, newName: string, newRationale: string) => void;
}

function EditToolDialog({ tool, onSave }: EditToolDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toolName, setToolName] = useState(tool.toolName);
  const [rationale, setRationale] = useState(tool.rationale);

  const handleSave = () => {
    onSave(tool.id, toolName, rationale);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Edit3 className="h-4 w-4" />
          <span className="sr-only">Edit Tool</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tool Recommendation</DialogTitle>
          <DialogDescription>Update the details for this tool.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toolName" className="text-right">Tool Name</Label>
            <Input id="toolName" value={toolName} onChange={(e) => setToolName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rationale" className="text-right">Rationale</Label>
            <Textarea id="rationale" value={rationale} onChange={(e) => setRationale(e.target.value)} className="col-span-3 min-h-[100px]" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface AlternativeToolsDialogProps {
  tool: ToolRecommendationItem;
  alternatives: SuggestAlternativeToolsOutput['alternatives'] | null;
  isLoading: boolean;
  onSelectAlternative: (toolId: string, altName: string, altRationale: string) => void;
}

function AlternativeToolsDialog({ tool, alternatives, isLoading, onSelectAlternative }: AlternativeToolsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Replace className="mr-1.5 h-3.5 w-3.5" />
          Alternatives
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alternative Tools for {tool.useCase}</DialogTitle>
          <DialogDescription>Current tool: {tool.toolName}. Explore other options.</DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Fetching alternatives...</p>
          </div>
        )}
        {!isLoading && alternatives && alternatives.length > 0 && (
          <ul className="space-y-3 max-h-60 overflow-y-auto p-1">
            {alternatives.map((alt, index) => (
              <li key={index} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{alt.toolName}</p>
                    <p className="text-sm text-muted-foreground">{alt.reason}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      onSelectAlternative(tool.id, alt.toolName, alt.reason);
                      setIsOpen(false);
                    }}
                  >
                    Select
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && (!alternatives || alternatives.length === 0) && (
          <p className="text-center text-muted-foreground p-4">No alternatives found or an error occurred.</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function ToolRecommendationsSection() {
  const { plan, updateToolRecommendation, fetchAlternativeTools, isLoading: isPlanLoading } = usePlan();
  const [alternativeToolsData, setAlternativeToolsData] = useState<Record<string, SuggestAlternativeToolsOutput['alternatives'] | null>>({});
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState<Record<string, boolean>>({});


  const handleFetchAlternatives = async (tool: ToolRecommendationItem) => {
    setIsFetchingAlternatives(prev => ({...prev, [tool.id]: true}));
    const alternatives = await fetchAlternativeTools(tool);
    setAlternativeToolsData(prev => ({ ...prev, [tool.id]: alternatives ? alternatives.alternatives : null}));
    setIsFetchingAlternatives(prev => ({...prev, [tool.id]: false}));
  };


  if (!plan) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          Recommended Tools & Software
        </CardTitle>
        <CardDescription>AI-suggested tools to help you run your business efficiently. You can customize these.</CardDescription>
      </CardHeader>
      <CardContent>
        {plan.toolRecommendations.length > 0 ? (
          <ul className="space-y-4">
            {plan.toolRecommendations.map((tool: ToolRecommendationItem) => (
              <li key={tool.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-accent" />
                      {tool.toolName}
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{tool.useCase}</p>
                  </div>
                  <EditToolDialog tool={tool} onSave={updateToolRecommendation} />
                </div>
                <p className="text-sm text-foreground/80 mb-2">{tool.rationale}</p>
                 <div className="flex justify-end">
                  <Dialog> {/* Parent Dialog for AlternativeToolsDialog trigger */}
                    <DialogTrigger asChild>
                       <Button variant="outline" size="sm" className="text-xs" onClick={() => handleFetchAlternatives(tool)} disabled={isFetchingAlternatives[tool.id] || isPlanLoading}>
                         {isFetchingAlternatives[tool.id] ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Replace className="mr-1.5 h-3.5 w-3.5" /> }
                        Alternatives
                      </Button>
                    </DialogTrigger>
                    {/* AlternativeToolsDialog is now triggered by its own DialogTrigger but needs its content within a Dialog for context */}
                     <AlternativeToolsDialog
                        tool={tool}
                        alternatives={alternativeToolsData[tool.id] || null}
                        isLoading={isFetchingAlternatives[tool.id] || false}
                        onSelectAlternative={updateToolRecommendation}
                      />
                   </Dialog>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No tool recommendations available in the plan yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

