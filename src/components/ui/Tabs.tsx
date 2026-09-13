import { Icon } from "@/components/ui/Icon";
import type { SymbolViewProps } from "expo-symbols";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { Text } from "./Text";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon?: SymbolViewProps["name"];
  badge?: number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Set false to hug each label's width instead of splitting the row equally. @default true */
  stretch?: boolean;
  /** Color of the active tab's underline. @default colors.light.primary[500] */
  indicatorColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  stretch = true,
  indicatorColor = colors.light.primary[500],
  style,
}: TabsProps<T>) {
  return (
    <View style={[styles.row, style]}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            style={stretch ? styles.itemStretch : styles.itemInline}
            onPress={() => onChange(tab.value)}
          >
            <View style={styles.labelRow}>
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size={16}
                  tintColor={active ? colors.light.text : colors.light.textSoft}
                />
              )}
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
              {!!tab.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            {active && (
              <View
                style={[styles.indicator, { backgroundColor: indicatorColor }]}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemInline: {
    paddingBottom: 12,
    marginRight: 24,
  },
  itemStretch: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.textSoft,
  },
  labelActive: {
    color: colors.light.text,
  },
  indicator: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.light.primary[500],
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light.primary[100],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.light.primary[600],
  },
});
