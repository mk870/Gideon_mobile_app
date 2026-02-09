import { Tabs, useSegments } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import HistoryBottomSheet from "@/src/Components/BottomSheets/History/HistoryBottomSheet";
import Screen from "@/src/Components/ScreenWrapper/Screen";
import TabsIcons from "@/src/Components/TabsIcons/TabsIcons";
import TabsLabels from "@/src/Components/TabsLabels/TabsLabels";
import { useBottomSheetsContext } from "@/src/Context/BottomSheetsContext";
import StackWrapper from "@/src/HOCs/StackWrapper";
import { colorScheme, primary, white } from "@/src/Theme/Colors";
import { family, large } from "@/src/Theme/Font";
import { tabsMenu } from "@/src/Utils/Constants";

const TabsLayout = () => {
  const segments = useSegments();
  const isSettingsRoot = segments.length === 2;
  const { isHistoryBottomSheetOpen } = useBottomSheetsContext();
  return (
    <Screen>
      <Tabs
        screenOptions={{
          headerTitleStyle: {
            fontFamily: family,
            color: colorScheme.text,
            fontSize: large,
            textAlign: "left",
          },
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colorScheme.background,
            height: 100,
          },
          tabBarStyle: [
            styles.tabStyles,
            {
              backgroundColor: colorScheme.background,
              borderTopColor: colorScheme.background,
            },
          ],
          tabBarInactiveTintColor: white,
          tabBarActiveTintColor: primary,
          tabBarLabelPosition: "below-icon",
        }}
      >
        <Tabs.Screen
          name="chats"
          options={{
            title: tabsMenu.chats,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcons
                focused={focused}
                color={color}
                name={tabsMenu.chats}
              />
            ),
            tabBarLabel: ({ focused }) =>
              focused ? (
                ""
              ) : (
                <TabsLabels focused={focused} textItem={tabsMenu.chats} />
              ),
          }}
        />
        <Tabs.Screen
          name="voice"
          options={{
            title: tabsMenu.voice,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcons
                focused={focused}
                color={color}
                name={tabsMenu.voice}
              />
            ),
            tabBarLabel: ({ focused }) =>
              focused ? (
                ""
              ) : (
                <TabsLabels focused={focused} textItem={tabsMenu.voice} />
              ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: isSettingsRoot,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcons
                focused={focused}
                color={color}
                name={tabsMenu.settings}
              />
            ),
            tabBarLabel: ({ focused }) =>
              focused ? (
                ""
              ) : (
                <TabsLabels focused={focused} textItem={tabsMenu.settings} />
              ),
          }}
        />
      </Tabs>
      {isHistoryBottomSheetOpen && <HistoryBottomSheet />}
    </Screen>
  );
};
export default StackWrapper(TabsLayout);

const styles = StyleSheet.create({
  tabStyles: {
    borderTopWidth: 0,
    paddingTop: 2,
    elevation: 0,
  },
});
