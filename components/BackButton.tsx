import React, { ComponentProps } from "react";
import { Button, ButtonIcon, ArrowLeftIcon } from "@/components/ui";
import { router, type Href } from "expo-router";

/**
 * A reusable back navigation button component that handles navigation history intelligently.
 *
 * Features:
 * - Automatically navigates back if history exists, otherwise goes to fallback route
 * - Extends all Button component props for full customization
 * - Includes accessibility and touch target optimizations
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BackButton />
 *
 * // With custom fallback
 * <BackButton fallbackRoute="/home" />
 *
 * // With custom styling
 * <BackButton variant="solid" size="lg" className="my-custom-class" />
 * ```
 */

interface BackButtonProps
  extends Omit<ComponentProps<typeof Button>, "onPress" | "onPressIn"> {
  /** Route to navigate to when no navigation history exists. Defaults to "/(tabs)" */
  fallbackRoute?: Href;
  /** Increases touch target size for better usability. Defaults to 10px */
  hitSlop?:
    | number
    | { top?: number; left?: number; right?: number; bottom?: number };
  /** Accessibility label for screen readers. Defaults to "Go back" */
  accessibilityLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  size = "md",
  variant = "outline",
  disabled = false,
  fallbackRoute = "/(tabs)",
  className = "",
  hitSlop = 10,
  accessibilityLabel = "Go back",
  ...restProps
}) => {
  /**
   * Handles back navigation with fallback logic
   */
  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      disabled={disabled}
      className={`w-10 h-10 rounded-lg p-1 ml-2 mr-2 ${className}`}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint="Navigate to the previous screen"
      {...restProps}
    >
      <ButtonIcon as={ArrowLeftIcon} size={size} />
    </Button>
  );
};
