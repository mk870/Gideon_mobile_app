import { Stack, useRouter } from "expo-router";
import React from "react";

import HeaderIcon from "@/src/Components/Navigation/HeaderIcon/HeaderIcon";
import StackWrapper from "@/src/HOCs/StackWrapper";
import { colorScheme } from "@/src/Theme/Colors";
import { family } from "@/src/Theme/Font";

const SettingsLayout = () => {
  const route = useRouter();
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          color: colorScheme.text,
          fontFamily: family,
        },
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <HeaderIcon iconName="arrow-back" onPressFunc={() => route.back()} />
        ),
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="notifications"
        options={{
          headerTitle: "Notifications",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerTitle: "Security & Privacy",
        }}
      />
      <Stack.Screen
        name="offline-messages"
        options={{
          headerTitle: "Offline Messages",
        }}
      />
      <Stack.Screen name="devices/index" options={{ headerTitle: "Devices" }} />
      <Stack.Screen
        name="history/index"
        options={{
          headerTitle: "History",
          headerRight: () => (
            <HeaderIcon iconName="menu-outline" onPressFunc={() => {}} />
          ),
        }}
      />
      <Stack.Screen
        name="contacts/index"
        options={{ headerTitle: "Contacts" }}
      />
      <Stack.Screen
        name="memories/index"
        options={{ headerTitle: "Memories" }}
      />
    </Stack>
  );
};

export default StackWrapper(SettingsLayout);
