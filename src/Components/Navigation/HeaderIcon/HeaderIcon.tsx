import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { colorScheme } from "@/src/Theme/Colors";

type Props = {
  onPressFunc?: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
};

const HeaderIcon: React.FC<Props> = ({ onPressFunc, iconName, iconSize }) => {
  const { iconContainer, icon } = styles;
  return (
    <TouchableOpacity style={iconContainer} onPress={onPressFunc}>
      <Ionicons
        name={iconName}
        size={iconSize ? iconSize : 22}
        color={colorScheme.text}
        style={icon}
      />
    </TouchableOpacity>
  );
};

export default HeaderIcon;

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    borderWidth: 1,
    backgroundColor: colorScheme.lightBackGround,
  },
  icon: {
    alignSelf: "center",
  },
});
