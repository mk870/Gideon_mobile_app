import { gray } from "@/src/Theme/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Href } from "expo-router";

export type ISettingsOptions = {
  name: string;
  icon: React.JSX.Element;
  route: Href;
}[];

const iconSize = 26;
const iconColor = gray;

export const settingsOptions: ISettingsOptions = [
  {
    name: "Chat History",
    icon: <MaterialIcons name="history" size={iconSize} color={iconColor} />,
    route: "/settings/history",
  },
  {
    name: "Notifications",
    icon: (
      <Ionicons
        name="notifications-outline"
        size={iconSize}
        color={iconColor}
      />
    ),
    route: "/settings/notifications",
  },
  {
    name: "Security & Privacy",
    icon: (
      <Ionicons name="lock-closed-outline" size={iconSize} color={iconColor} />
    ),
    route: "/settings/privacy",
  },
  {
    name: "My Devices",
    icon: (
      <Ionicons
        name="phone-portrait-outline"
        size={iconSize}
        color={iconColor}
      />
    ),
    route: "/settings/devices",
  },
  {
    name: "Profile",
    icon: (
      <Ionicons
        name="person-circle-outline"
        size={iconSize}
        color={iconColor}
      />
    ),
    route: "/settings/profile",
  },
  {
    name: "My Contacts",
    icon: <Ionicons name="people-outline" size={iconSize} color={iconColor} />,
    route: "/settings/contacts",
  },
  {
    name: "Memories",
    icon: <Ionicons name="albums-outline" size={iconSize} color={iconColor} />,
    route: "/settings/memories",
  },
  {
    name: "Offline Messages",
    icon: (
      <Ionicons
        name="cloud-offline-outline"
        size={iconSize}
        color={iconColor}
      />
    ),
    route: "/settings/offline-messages",
  },
  {
    name: "Voice",
    icon: <Ionicons name="mic-outline" size={iconSize} color={iconColor} />,
    route: "/voice",
  },
  {
    name: "Chat",
    icon: (
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={iconSize}
        color={iconColor}
      />
    ),
    route: "/chats",
  },
];
