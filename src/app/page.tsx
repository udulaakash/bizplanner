import Image from 'next/image';
import { BusinessIdeaForm } from '@/components/biz-plan/BusinessIdeaForm';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary to-accent/80 rounded-xl shadow-xl text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md">
            Craft Your Success Story
          </h1>
          <p className="mx-auto max-w-[700px] text-lg md:text-xl mt-4 opacity-90 drop-shadow-sm">
            Turn your brilliant business idea into a concrete action plan with BizPlan Architect. Get AI-powered insights, track progress, and customize your path to launch.
          </p>
          <div className="mt-8 relative aspect-[4/1] max-w-3xl mx-auto overflow-hidden rounded-lg shadow-inner">
             <Image
                src="https://picsum.photos/1200/300"
                alt="Business planning illustration"
                layout="fill"
                objectFit="cover"
                data-ai-hint="team collaboration"
                priority
              />
          </div>
        </div>
      </section>

      <section className="w-full max-w-2xl p-8 bg-card text-card-foreground rounded-xl shadow-lg">
        <BusinessIdeaForm />
      </section>
    </div>
  );
}
