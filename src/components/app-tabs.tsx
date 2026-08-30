import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import type { SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassView } from "@/components/ui/GlassView";
import { Icon } from "@/components/ui/Icon";
import { SideDrawer } from "@/components/home";
import { useAuthStore, useUIStore } from "@/store";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/radii";
import { shadows } from "@/theme/shadows";

interface TabConfig {
  name: string;
  href: string;
  label: string;
  icon: SymbolViewProps["name"];
  activeIcon: SymbolViewProps["name"];
}

const TABS: TabConfig[] = [
  {
    name: "home",
    href: "/home",
    label: "Home",
    icon: "house",
    activeIcon: "house.fill",
  },
  {
    name: "community",
    href: "/community",
    label: "Spaces",
    icon: "person.2",
    activeIcon: "person.2.fill",
  },
  {
    name: "events",
    href: "/events",
    label: "Events",
    icon: "calendar",
    activeIcon: "calendar",
  },
  {
    name: "chat",
    href: "/chat",
    label: "Chat",
    icon: "message",
    activeIcon: "message.fill",
  },
];

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isDrawerOpen = useUIStore((s) => s.isDrawerOpen);
  const closeDrawer = useUIStore((s) => s.closeDrawer);
  const firstName = user?.displayName?.split(" ")[0] ?? "Amy";

  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList asChild>
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          style={StyleSheet.flatten([
            styles.bar,
            { bottom: insets.bottom + 8 },
          ])}
        >
          {TABS.map((tab) => (
            <TabTrigger
              key={tab.name}
              name={tab.name}
              href={tab.href as any}
              asChild
            >
              <TabButton tab={tab} />
            </TabTrigger>
          ))}
        </GlassView>
      </TabList>

      <SideDrawer
        visible={isDrawerOpen}
        onClose={closeDrawer}
        name={user?.displayName ?? "Amy Johnson"}
        avatarUri={user?.avatarUrl}
        avatarInitials={firstName.slice(0, 2).toUpperCase()}
      />
    </Tabs>
  );
}

function TabButton({
  tab,
  isFocused,
  ...props
}: TabTriggerSlotProps & { tab: TabConfig }) {
  const tint = isFocused ? colors.light.primary[500] : colors.light.text;

  return (
    <Pressable {...props} style={styles.item}>
      <View style={[styles.itemPill, isFocused && styles.itemPillActive]}>
        <Icon
          name={isFocused ? tab.activeIcon : tab.icon}
          size={22}
          tintColor={tint}
        />
        <Text style={[styles.label, { color: tint }]}>{tab.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: radii.full,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    ...shadows.lg,
  },
  item: {
    flex: 1,
  },
  itemPill: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  itemPillActive: {
    backgroundColor: colors.light.primary[50],
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
