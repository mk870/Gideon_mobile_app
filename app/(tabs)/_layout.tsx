import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import Screen from "@/src/Components/ScreenWrapper/Screen";
import TabsIcons from "@/src/Components/TabsIcons/TabsIcons";
import TabsLabels from "@/src/Components/TabsLabels/TabsLabels";
import StackWrapper from "@/src/HOCs/StackWrapper";
import { colorScheme, gray, primary } from "@/src/Theme/Colors";
import { family, large } from "@/src/Theme/Font";
import { tabsMenu } from "@/src/Utils/Constants";

const TabsLayout = () => {
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
              borderTopColor: colorScheme.darkGray,
            },
          ],
          tabBarInactiveTintColor: gray,
          tabBarActiveTintColor: primary,
          tabBarLabelPosition: "below-icon",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: tabsMenu.home,
            tabBarIcon: ({ color, focused }) => (
              <TabsIcons focused={focused} color={color} name={tabsMenu.home} />
            ),
            tabBarLabel: ({ focused }) => (
              <TabsLabels focused={focused} textItem={tabsMenu.home} />
            ),
          }}
        />
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
            tabBarLabel: ({ focused }) => (
              <TabsLabels focused={focused} textItem={tabsMenu.chats} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <TabsIcons
                focused={focused}
                color={color}
                name={tabsMenu.settings}
              />
            ),
            tabBarLabel: "",
          }}
        />
      </Tabs>
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
