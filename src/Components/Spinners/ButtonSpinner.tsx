import React from "react";
import { ActivityIndicator, View } from "react-native";

import { colorScheme } from "@/src/Theme/Colors";

const ButtonSpinner: React.FC<{ backGroundColor?: string }> = ({
  backGroundColor,
}) => {
  return (
    <View style={{ width: "100%" }}>
      <ActivityIndicator
        size={"small"}
        color={backGroundColor ? backGroundColor : colorScheme.text}
      />
    </View>
  );
};

export default ButtonSpinner;
