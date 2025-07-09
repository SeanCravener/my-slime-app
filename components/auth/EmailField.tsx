import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { Icon, MailIcon } from "@/components/ui/icon";

interface EmailFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  isDisabled?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  control,
  errors,
  isDisabled = false,
}) => {
  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { value, onChange } }) => (
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <Text className="text-sm font-medium text-foreground mb-2">
              Email
            </Text>
          </FormControlLabel>
          <Input variant="outline" size="lg" isInvalid={!!errors.email}>
            <InputSlot className="pl-3">
              <InputIcon as={MailIcon} className="text-muted-foreground" />
            </InputSlot>
            <InputField
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              value={value || ""}
              onChangeText={onChange}
              editable={!isDisabled}
              className="text-foreground"
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>
              {errors.email?.message as string}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
};
