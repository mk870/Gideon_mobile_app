import { colorScheme } from "@/src/Theme/Colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

const Screen: React.FC<Props> = ({ children }) => {
  return (
    <View style={styles.screen}>
      <StatusBar style={"light"} />
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colorScheme.background
  },
});
