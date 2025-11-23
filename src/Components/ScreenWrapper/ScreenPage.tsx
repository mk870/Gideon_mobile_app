import { colorScheme } from "@/src/Theme/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

const ScreenPage: React.FC<Props> = ({ children }) => {
  return <View style={styles.screen}>{children}</View>;
};

export default ScreenPage;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colorScheme.background,
  },
});
