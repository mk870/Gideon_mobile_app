import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Animated } from "react-native";

import { tabsMenu } from "@/src/Utils/Constants";

type Props = {
  focused: boolean;
  name: string;
  color: string;
};

const TabsIcons: React.FC<Props> = ({ focused, name, color }) => {
  const iconSize = 24;
  const focusedIconSize = 30
  const icons = () => {
    if (name === tabsMenu.voice) {
      if (focused)
        return (
          <MaterialIcons name="keyboard-voice" color={color} size={focusedIconSize} />
        );
      else
        return (
          <MaterialIcons name="keyboard-voice" color={color} size={iconSize} />
        );
    } else if (name === tabsMenu.settings) {
      if (focused)
        return <Ionicons name="settings-sharp" size={focusedIconSize} color={color} />;
      else
        return (
        <Ionicons name="settings-sharp" size={iconSize} color={color} />
        );
    } else if (name === tabsMenu.chats) {
      if (focused)
        return <Ionicons name="chatbox" size={focusedIconSize} color={color} />;
      else
        return (
          <Ionicons name="chatbox" size={iconSize} color={color} />
        );
    }
  };
  return <Animated.View>{icons()}</Animated.View>;
};

export default TabsIcons;
