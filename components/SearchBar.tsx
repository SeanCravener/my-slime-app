import React, { useState } from "react";
import { Keyboard } from "react-native";
import { Box } from "@/components/ui/box";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonIcon } from "@/components/ui/button";
import { SearchIcon, CloseIcon } from "@/components/ui/icon";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onSearch,
}) => {
  const [localValue, setLocalValue] = useState("");

  const searchValue = value !== undefined ? value : localValue;
  const setValue = onChangeText ?? setLocalValue;

  const handleSubmit = () => {
    onSearch(searchValue.trim());
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    Keyboard.dismiss();
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    // Trigger search as user types
    onSearch(text.trim());
  };

  return (
    <Box className="mx-2 mb-2">
      <Input
        variant="outline"
        className="bg-muted"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} className="text-muted-foreground" />
        </InputSlot>

        <InputField
          placeholder={placeholder}
          value={searchValue}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          className="text-foreground"
        />

        {searchValue.length > 0 && (
          <InputSlot className="pr-2">
            <Button
              variant="link"
              size="sm"
              onPress={handleClear}
              className="w-8 h-8 rounded-full"
            >
              <ButtonIcon as={CloseIcon} />
            </Button>
          </InputSlot>
        )}
      </Input>
    </Box>
  );
};
