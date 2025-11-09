import React from "react";
import { StyleSheet, View } from "react-native";
import { colorScheme } from "../Theme/Colors";


const StackWrapper = (Stack: React.FC) => {
  const useStackWrapper = (props: any) => {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colorScheme.background,
          },
        ]}
      >
        <Stack {...props} />
      </View>
    );
  };
  return useStackWrapper;
};

export default StackWrapper;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
