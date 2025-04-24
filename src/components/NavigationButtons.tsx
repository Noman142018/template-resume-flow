
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

type NavigationButtonsProps = {
  nextPath?: string;
  prevPath?: string;
  nextLabel?: string;
  prevLabel?: string;
  onNextClick?: () => boolean;
};

export default function NavigationButtons({
  nextPath,
  prevPath,
  nextLabel = "Next",
  prevLabel = "Back",
  onNextClick,
}: NavigationButtonsProps) {
  const { currentStep, setCurrentStep } = useResume();
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNextClick) {
      const canProceed = onNextClick();
      if (!canProceed) return;
    }

    if (nextPath) {
      setCurrentStep(currentStep + 1);
      navigate(nextPath);
    }
  };

  const handlePrev = () => {
    if (prevPath) {
      setCurrentStep(currentStep - 1);
      navigate(prevPath);
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {prevPath ? (
        <Button
          variant="outline"
          onClick={handlePrev}
          className="px-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {prevLabel}
        </Button>
      ) : (
        <div></div> // Empty div to maintain flex layout
      )}
      
      {nextPath && (
        <Button onClick={handleNext} className="px-6 flex items-center gap-2">
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
