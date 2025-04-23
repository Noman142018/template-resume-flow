
import { useResume } from "@/context/ResumeContext";
import { cn } from "@/lib/utils";

type StepProgressProps = {
  className?: string;
};

export default function StepProgress({ className }: StepProgressProps) {
  const { currentStep } = useResume();
  const steps = [
    { step: 1, label: "Welcome" },
    { step: 2, label: "Template" },
    { step: 3, label: "Personal" },
    { step: 4, label: "Education" },
    { step: 5, label: "Experience" },
    { step: 6, label: "Preview" },
  ];

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4 md:px-0">
        {steps.map((step, index) => (
          <div key={step.step} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep >= step.step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.step}
            </div>
            <span className="mt-1 text-xs hidden sm:block">{step.label}</span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "hidden sm:block absolute h-[2px] w-[calc((100%-80px)/5)] transition-colors",
                  currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
                )}
                style={{
                  left: `calc(${(100 / (steps.length - 1)) * (index + 0.5)}% - ${
                    (80 / (steps.length - 1)) * (index + 0.5)
                  }px)`,
                  top: "20px",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
