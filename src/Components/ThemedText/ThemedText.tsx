import React from "react";
import {
  Text,
  TextStyle,
} from "react-native";

import { colorScheme } from "@/src/Theme/Colors";
import { family, large, medium, small } from "@/src/Theme/Font";

type Props = {
  styles?: TextStyle;
  type: "regular" | "subHeader" | "header";
  children: React.ReactNode;
};

const ThemedText: React.FC<Props> = ({ styles, type, children }) => {
  return (
    <Text
      style={[
        styles,
        {
          fontFamily: family,
          fontSize:
            type === "header" ? large : type === "subHeader" ? medium : small,
          fontWeight:
            type === "header" ? "bold" : type === "subHeader" ? "800" : "400",
          color: colorScheme.text,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
