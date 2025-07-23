import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, SunIcon, MoonIcon } from "@/components/ui/icon";

type ThemeMode = "light" | "dark";

interface ThemeToggleButtonProps {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showLabel?: boolean;
}

const themeOptions = [
  {
    mode: "light" as ThemeMode,
    label: "Light",
    icon: SunIcon,
  },
  {
    mode: "dark" as ThemeMode,
    label: "Dark",
    icon: MoonIcon,
  },
];

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  size = "md",
  disabled = false,
  showLabel = true,
}) => {
  const { themeMode, setThemeMode } = useTheme();

  const currentThemeOption = themeOptions.find(
    (option) => option.mode === themeMode
  );

  const handleToggle = () => {
    // Simple toggle: light ↔ dark
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  };

  // Render the correct icon based on current theme
  const renderIcon = () => {
    const iconSize = size;

    if (themeMode === "light") {
      return <Icon as={SunIcon} size={iconSize} color="#007AFF" />;
    } else {
      return <Icon as={MoonIcon} size={iconSize} color="#007AFF" />;
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onPress={handleToggle}
      isDisabled={disabled}
    >
      {renderIcon()}
      {showLabel && (
        <ButtonText className="text-primary ml-2">
          {currentThemeOption?.label || themeMode}
        </ButtonText>
      )}
    </Button>
  );
};
