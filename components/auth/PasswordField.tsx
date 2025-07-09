import React, { useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon, EyeIcon, EyeOffIcon, LockIcon } from "@/components/ui/icon";

interface PasswordFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  name: "password" | "confirmPassword";
  label: string;
  placeholder: string;
  isDisabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  control,
  errors,
  name,
  label,
  placeholder,
  isDisabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormControl isInvalid={!!errors[name]}>
          <FormControlLabel>
            <Text className="text-sm font-medium text-foreground mb-2">
              {label}
            </Text>
          </FormControlLabel>
          <Input variant="outline" size="lg" isInvalid={!!errors[name]}>
            <InputSlot className="pl-3">
              <InputIcon as={LockIcon} className="text-muted-foreground" />
            </InputSlot>
            <InputField
              placeholder={placeholder}
              secureTextEntry={!showPassword}
              autoComplete={
                name === "password" ? "current-password" : "new-password"
              }
              textContentType={name === "password" ? "password" : "newPassword"}
              value={value || ""}
              onChangeText={onChange}
              editable={!isDisabled}
              className="text-foreground"
            />
            <InputSlot className="pr-3">
              <Pressable onPress={togglePassword} hitSlop={8}>
                <InputIcon
                  as={showPassword ? EyeOffIcon : EyeIcon}
                  className="text-muted-foreground"
                />
              </Pressable>
            </InputSlot>
          </Input>
          <FormControlError>
            <FormControlErrorText>
              {errors[name]?.message as string}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
};
