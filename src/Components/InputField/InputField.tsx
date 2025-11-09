import {
  ColorSchemeName,
  DimensionValue,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  Fontisto,
  Feather,
  Ionicons,
  Octicons,
  EvilIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { ContentType } from "./Types/Types";
import { IVoidFunc } from "@/src/GlobalTypes/Types";
import { dark, light, red } from "@/src/Theme/Colors";
import ThemedText from "../ThemedText/ThemedText";
import { useAppSelector } from "@/src/Redux/Hooks/Config";
import Row from "../Row/Row";

type Props = {
  width: DimensionValue;
  height: DimensionValue;
  placeHolder: string;
  handleOnChangeText: (text: string) => void;
  handleOnEnter?: IVoidFunc;
  textValue: string | undefined;
  contentType: ContentType;
  type: string;
  label?: string;
  isFocused?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  isRequired?: boolean;
  multiLine?: boolean;
};

const InputField: React.FC<Props> = ({
  width,
  height,
  placeHolder,
  handleOnChangeText,
  textValue,
  contentType,
  type,
  label,
  isFocused,
  backgroundColor,
  handleOnEnter,
  borderColor,
  isRequired,
  multiLine,
}) => {
  const [ispassWordHidden, setIsPassWordHidden] = useState<boolean>(true);
  const iconSize = 20;
  const iconColor = "gray";
  const theme = useAppSelector((state) => state.theme.value);
  const secureText = () => {
    if (type === "password") {
      if (ispassWordHidden) return true;
      else return false;
    } else return false;
  };
  const keyboardAppearance = () => {
    if (type === "emailAddress") return "email-address";
    else if (type === "number") return "number-pad";
    else return "default";
  };

  return (
    <View style={styles(width, height, theme).container}>
      {label && (
        <Row style={styles(width, height, theme).labelContainer}>
          <ThemedText type="regular">{label}</ThemedText>
          {isRequired && (
            <View style={{ marginTop: 5 }}>
              <FontAwesome5 name="star-of-life" size={7} color={red} />
            </View>
          )}
        </Row>
      )}
      <View style={styles(width, height, theme).inputWrapper}>
        {type === "emailAddress" && (
          <Fontisto
            name="email"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
          />
        )}
        {type === "search" && (
          <Feather
            name="search"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
            onPress={handleOnEnter}
          />
        )}
        {type === "password" && ispassWordHidden && (
          <Feather
            name="eye"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
            onPress={() => setIsPassWordHidden((value) => !value)}
          />
        )}
        {type === "password" && !ispassWordHidden && (
          <Feather
            name="eye-off"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
            onPress={() => setIsPassWordHidden((value) => !value)}
          />
        )}
        {type === "givenName" && (
          <Ionicons
            name="person-outline"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
          />
        )}
        {type === "familyName" && (
          <Ionicons
            name="people-outline"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
          />
        )}
        {label === "Code" && (
          <Octicons
            name="verified"
            size={iconSize}
            color={iconColor}
            style={styles(width, height, theme).icon}
          />
        )}
        {type === "location" && (
          <EvilIcons
            name="location"
            size={26}
            color={iconColor}
            style={styles(width, height, theme).icon}
          />
        )}
        <TextInput
          style={[
            styles(width, height, theme, borderColor).input,
            {
              paddingRight:
                type === "location" ||
                type === "emailAddress" ||
                type === "search" ||
                type === "password" ||
                type === "givenName" ||
                type === "familyName" ||
                label === "Code"
                  ? 35
                  : 10,
              backgroundColor: backgroundColor
                ? backgroundColor
                : theme === "light"
                ? light.background
                : dark.darkGray,
            },
          ]}
          value={textValue}
          onChangeText={handleOnChangeText}
          placeholder={placeHolder}
          multiline={multiLine}
          textContentType={contentType}
          placeholderTextColor={"gray"}
          keyboardType={keyboardAppearance()}
          cursorColor={theme === "light" ? light.text : dark.text}
          autoCorrect={false}
          enterKeyHint={"enter"}
          keyboardAppearance={theme === "light" ? "light" : "dark"}
          secureTextEntry={secureText()}
          autoFocus={isFocused ? isFocused : false}
          onSubmitEditing={handleOnEnter}
        />
      </View>
    </View>
  );
};

export default InputField;

const styles = (
  width: DimensionValue,
  height: DimensionValue,
  theme: ColorSchemeName,
  borderColor?: string
) =>
  StyleSheet.create({
    container: {
      width: "100%",
      borderRadius: 7,
      gap: 2,
      backgroundColor: "transparent",
    },
    labelContainer: {
      width: "100%",
      gap: 5,
      marginBottom: -3,
    },
    inputWrapper: {
      width: width,
      height: height,
      borderRadius: 7,
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    icon: {
      zIndex: 2,
      position: "absolute",
      right: "5%",
    },
    input: {
      height: height,
      width: "100%",
      textAlign: "left",
      paddingLeft: 10,
      position: "relative",
      borderRadius: 7,
      color: theme === "dark" ? dark.text : light.text,
      borderColor: borderColor
        ? borderColor
        : theme === "dark"
        ? dark.background
        : light.background,
      borderWidth: 1,
    },
  });
