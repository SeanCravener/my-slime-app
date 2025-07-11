import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <VStack space="sm">
      <Text size="sm">
        Step {currentStep} of {totalSteps}
      </Text>
      <Progress value={progress} className="h-2">
        <ProgressFilledTrack className="h-2" />
      </Progress>
    </VStack>
  );
};
