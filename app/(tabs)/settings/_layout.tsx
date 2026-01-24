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
        headerLeft: () => (
          <HeaderIcon iconName="arrow-back" onPressFunc={() => route.back()} />
        ),
        headerTransparent: true,
      }}
    >
      <Stack.Screen name="settings/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="notifications"
        options={{ headerTitle: "Notifications", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerTitle: "Security & Privacy",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="offline-messages"
        options={{
          headerTitle: "Offline Messages",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="settings/devices/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="settings/history/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="contacts/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings/memories/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default StackWrapper(SettingsLayout);
