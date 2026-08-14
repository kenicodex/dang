import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";

type Variant = "primary" | "outline" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  title: string;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  title,
  icon,
  loading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        (disabled || loading) && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.light.text : "#FFFFFF"}
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.text, styles[`text_${variant}`]]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  variant_primary: {
    backgroundColor: colors.light.text,
  },
  variant_outline: {
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  variant_secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.light.primary[500],
  },
  variant_ghost: {
    backgroundColor: "transparent",
  },
  variant_danger: {
    backgroundColor: colors.light.danger,
  },
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
  text_primary: {
    color: colors.light.neutral.white,
  },
  text_outline: {
    color: colors.light.text,
  },
  text_secondary: {
    color: colors.light.primary[500],
  },
  text_ghost: {
    color: colors.light.primary[500],
  },
  text_danger: {
    color: colors.light.neutral.white,
  },
});
