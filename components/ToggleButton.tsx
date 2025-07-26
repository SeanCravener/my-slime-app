import React from "react";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

interface ToggleButtonOption {
  value: string;
  label: string;
}

interface ToggleButtonProps {
  options: ToggleButtonOption[];
  activeValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  options,
  activeValue,
  onValueChange,
  className = "",
}) => {
  return (
    <HStack className={`mx-4 ${className}`}>
      {options.map((option, index) => {
        const isActive = activeValue === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        let borderRadius = "";
        if (isFirst) {
          borderRadius = "rounded-l-full";
        } else if (isLast) {
          borderRadius = "rounded-r-full";
        }

        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            className={`flex-1 py-3 px-4 ${
              isActive ? "bg-primary" : "bg-background border border-border"
            } ${borderRadius}`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              className={`text-center font-medium ${
                isActive ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
};
