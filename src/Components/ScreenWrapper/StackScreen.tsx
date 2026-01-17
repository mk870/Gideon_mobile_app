import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

const StackScreen: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={"light"} />
      <View style={styles.header} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={{ height: "100%" }}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StackScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 50,
  },
  scrollViewContainer: {
    paddingTop: 10,
    flexGrow: 1,
  },
});
