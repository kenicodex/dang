import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpaceCard } from "@/components/community/SpaceCard";
import { CATEGORIES, SPACES } from "@/components/community/spaces.data";
import { Avatar } from "@/components/ui/Avatar";
import { Text } from "@/components/ui/Text";
import { Tabs } from "@/components/ui/Tabs";
import { useAuthStore, useCommunityStore, useUIStore } from "@/store";
import { colors } from "@/theme/colors";

type Tab = "discover" | "mine";

export default function SpacesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const joinedSpaceIds = useCommunityStore((s) => s.joinedSpaceIds);
  const openDrawer = useUIStore((s) => s.openDrawer);

  const [tab, setTab] = useState<Tab>("discover");
  const [category, setCategory] = useState("All");

  const visibleSpaces = useMemo(() => {
    const base =
      tab === "mine"
        ? SPACES.filter((s) => joinedSpaceIds.includes(s.id))
        : SPACES;
    if (category === "All") return base;
    return base.filter((s) => s.category === category);
  }, [tab, category, joinedSpaceIds]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={openDrawer} hitSlop={8}>
          <Avatar
            initials={(user?.displayName ?? "Me").slice(0, 2).toUpperCase()}
            size="sm"
          />
        </Pressable>
        <Text variant="h3" style={styles.title}>
          Spaces
        </Text>
        <Pressable
          style={styles.searchButton}
          onPress={() => router.push("/(community)/search")}
        >
          <Icon
            name="magnifyingglass"
            size={16}
            tintColor={colors.light.text}
          />
        </Pressable>
      </View>

      <Tabs
        tabs={[
          { value: "discover", label: "Discover" },
          { value: "mine", label: "My spaces" },
        ]}
        value={tab}
        onChange={setTab}
        indicatorColor={colors.light.secondary[500]}
        style={styles.tabRow}
      />

      {tab === "discover" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((c) => {
            const isSelected = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelSelected,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {visibleSpaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            newCount={tab === "mine" ? 99 : undefined}
            onPress={() => router.push(`/(community)/channel/${space.id}`)}
          />
        ))}
        {visibleSpaces.length === 0 && (
          <Text style={styles.empty}>
            {tab === "mine"
              ? "You haven't joined any spaces yet."
              : "No spaces in this category yet."}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  tabRow: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  categoryScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 14,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },
  listScroll: {
    flex: 1,
  },
  categoryPill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.light.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryPillSelected: {
    backgroundColor: colors.light.secondary[500],
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    color: colors.light.text,
  },
  categoryLabelSelected: {
    color: colors.light.neutral.white,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  empty: {
    textAlign: "center",
    color: colors.light.textMuted,
    marginTop: 40,
  },
});
