import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import { primary } from "@/src/Theme/Colors";

const ScreenSpinner: INoPropsReactComponent = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={primary} />
    </View>
  );
};

export default ScreenSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 5,
  },
});
