import { SymbolView } from "expo-symbols";
import { ReactNode, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  leftIcon?: ReactNode;
  /** Renders an eye / eye-slash toggle inside the field; pairs with secureTextEntry. */
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  required,
  error,
  helperText,
  containerStyle,
  leftIcon,
  showPasswordToggle,
  style,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.field,
          isFocused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, !!leftIcon && styles.inputWithLeftIcon, style]}
          placeholderTextColor={colors.light.textSoft}
          secureTextEntry={showPasswordToggle ? !revealed : secureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {showPasswordToggle && (
          <Pressable
            hitSlop={8}
            onPress={() => setRevealed((v) => !v)}
            style={styles.toggle}
          >
            <SymbolView
              name={revealed ? "eye.slash" : "eye"}
              size={18}
              tintColor={colors.light.textSoft}
            />
          </Pressable>
        )}
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, !!error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  required: {
    color: colors.light.danger,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
  },
  fieldFocused: {
    borderColor: colors.light.primary[500],
  },
  fieldError: {
    borderColor: colors.light.danger,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.light.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 10,
  },
  toggle: {
    paddingHorizontal: 14,
  },
  helperText: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 6,
  },
  errorText: {
    color: colors.light.danger,
  },
});
