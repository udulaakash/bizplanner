"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { Loader2, Wand2 } from "lucide-react";

const FormSchema = z.object({
  businessIdea: z.string().min(10, {
    message: "Business idea must be at least 10 characters.",
  }).max(1000, {
    message: "Business idea must not exceed 1000 characters.",
  }),
});

export function BusinessIdeaForm() {
  const { generatePlan, isLoading, error } = usePlan();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessIdea: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await generatePlan(data.businessIdea);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="businessIdea"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">What's Your Big Idea?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your revolutionary business concept here... e.g., An AI-powered platform for personalized pet nutrition plans."
                  className="resize-none min-h-[150px] text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm">
                Provide a clear and concise description of your business idea. The more detail, the better the plan!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={isLoading} size="lg" className="w-full text-lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Action Plan
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
