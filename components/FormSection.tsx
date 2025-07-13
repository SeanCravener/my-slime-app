import React from "react";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { EditButton } from "@/components/EditButton";

interface FormSectionProps {
  /** Section title */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Show edit button in header */
  showEditButton?: boolean;
  /** Edit button handler */
  onEdit?: () => void;
  /** Custom card variant */
  variant?: "outline" | "filled" | "elevated";
  /** Section content */
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  showEditButton = false,
  onEdit,
  variant = "outline",
  children,
}) => {
  return (
    <Card variant={variant} className="p-4">
      <VStack space="md">
        {/* Header */}
        {(title || showEditButton) && (
          <HStack className="justify-between items-start">
            <VStack space="xs" className="flex-1">
              {title && (
                <Text size="lg" className="font-semibold text-foreground">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text size="sm" className="text-muted-foreground">
                  {subtitle}
                </Text>
              )}
            </VStack>

            {showEditButton && onEdit && (
              <EditButton onPress={onEdit} variant="solid" />
            )}
          </HStack>
        )}

        {/* Content */}
        <Box>{children}</Box>
      </VStack>
    </Card>
  );
};
