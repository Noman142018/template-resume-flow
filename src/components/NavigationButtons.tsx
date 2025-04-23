
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
      <Button
        variant="outline"
        onClick={handlePrev}
        disabled={!prevPath}
        className="px-6"
      >
        {prevLabel}
      </Button>
      <Button onClick={handleNext} disabled={!nextPath} className="px-6">
        {nextLabel}
      </Button>
    </div>
  );
}
