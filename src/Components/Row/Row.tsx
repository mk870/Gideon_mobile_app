import { StyleSheet, View, ViewStyle } from "react-native";
import React from "react";

type Props = {
  style?: ViewStyle;
  children: React.ReactNode;
};

const Row: React.FC<Props> = ({ style, children }) => {
  return <View style={[style, styles.container]}>{children}</View>;
};

export default Row;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
