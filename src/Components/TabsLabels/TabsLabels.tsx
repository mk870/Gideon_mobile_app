import React from "react";
import { Text } from "react-native";

import { primary, white } from "@/src/Theme/Colors";
import { family } from "@/src/Theme/Font";

type Props = {
  focused: boolean;
  textItem: string;
};

const TabsLabels: React.FC<Props> = ({ focused, textItem }) => {
  return (
    <Text
      style={{
        fontFamily: family,
        fontSize: 12,
        color: focused
            ? primary
            : white,
      }}
    >
      {textItem}
    </Text>
  );
};

export default TabsLabels;

