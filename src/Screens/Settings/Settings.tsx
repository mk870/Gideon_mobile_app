import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import CustomButton from "@/src/Components/Buttons/Custom/CustomButton";
import Screen from "@/src/Components/ScreenWrapper/Screen";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import { useAppSelector } from "@/src/Redux/Hooks/Config";
import { colorScheme, gray } from "@/src/Theme/Colors";
import {
  BUTTON_MAX_WIDTH,
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  expoSecureValueKeyNames,
} from "@/src/Utils/Constants";
import { saveSecureValue } from "@/src/Utils/Func";
import { styles } from "./Styles";
import { settingsOptions } from "./Utils";

const Settings: INoPropsReactComponent = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { accessToken } = useAppSelector((state) => state.user.value);

  const handleSignOut = async () => {
    await saveSecureValue(expoSecureValueKeyNames.accessToken, "");
    await saveSecureValue(expoSecureValueKeyNames.deviceCode, "");
    router.push("/login");
  };

  const onNavigate = (route: Href) => {
    router.push(route);
  };

  const iconSize = 26;
  const iconColor = gray;
  // console.log(
  //   "🚀 ~ file: Settings.tsx:24 ~ Settings ~ accessToken:",
  //   accessToken,
  // );

  return (
    <Screen>
      <StatusBar style={"light"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={[styles.optionsDetailsWrapper, { marginTop: 20 }]}>
          <View style={styles.optionsContainer}>
            {settingsOptions.map(({ name, icon, route }, index) => (
              <Pressable
                key={name}
                style={styles.option}
                onPress={() => onNavigate(route)}
              >
                {icon}
                <View
                  style={[
                    styles.optionIconText,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: colorScheme.darkGray,
                    },
                  ]}
                >
                  <Text
                    style={[styles.optionText, { color: colorScheme.text }]}
                  >
                    {name}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={iconSize}
                    color={iconColor}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <View
          style={[
            {
              width:
                width > BUTTON_SIZE_SCREEN_BREAK_POINT
                  ? BUTTON_MAX_WIDTH
                  : "100%",
            },
            styles.btn,
          ]}
        >
          <CustomButton
            title={accessToken ? "Logout" : "Login"}
            onPressFunc={accessToken ? handleSignOut : handleSignOut}
          />
          {!accessToken && (
            <TouchableOpacity
              style={styles.createAccountBtn}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.createAccountText}>create account</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Settings;
