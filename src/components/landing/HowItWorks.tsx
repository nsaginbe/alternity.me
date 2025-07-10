import React from 'react';
import { Camera, Zap, Sparkles } from 'lucide-react';

const timelineSteps = [
  {
    step: "Step 1",
    title: "Upload Your Photo",
    description: "Start by securely uploading a clear photo of yourself to begin the analysis.",
    icon: <Camera className="w-4 h-4" />
  },
  {
    step: "Step 2",
    title: "AI-Powered Analysis",
    description: "Our advanced AI analyzes your facial features to find your matches.",
    icon: <Zap className="w-4 h-4" />
  },
  {
    step: "Step 3",
    title: "Discover Your Matches",
    description: "Get a detailed report with your celebrity lookalike, spirit animal, and more.",
    icon: <Sparkles className="w-4 h-4" />
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">How It Works</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">A simple, three-step process to unlock a new side of you.</p>
        </div>

        <ol className="relative space-y-16 before:absolute before:top-0 before:left-6 before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 md:before:left-1/2 md:before:-translate-x-1/2">
          {timelineSteps.map((item, index) => (
            <li key={index} className="group relative grid grid-cols-1 md:grid-cols-2 md:odd:-me-3 md:even:-ms-3">
              <div className="relative flex items-start gap-6 md:group-odd:flex-row-reverse md:group-odd:text-right md:group-even:order-last">
                <span className="size-12 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
                  {index + 1}
                </span>

                <div className="-mt-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{item.description}</p>
                </div>
              </div>
              <div aria-hidden="true" className="hidden md:block"></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}; 