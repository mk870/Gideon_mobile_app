import { primary, white } from "@/src/Theme/Colors";
import { family, medium } from "@/src/Theme/Font";
import { activeOpacityOfTouchableOpacity } from "@/src/Utils/Constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonSpinner from "../../Spinners/ButtonSpinner";

type Props = {
  onPressFunc: () => void;
  title: string;
  width?: number;
  height?: number;
  color?: string;
  borderRadius?: number;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  textColor?: string;
};

const CustomButton: React.FC<Props> = ({
  onPressFunc,
  title,
  width,
  color,
  isDisabled,
  height,
  borderRadius,
  icon,
  textColor,
  iconPosition,
}) => {
  const { container, textStyles } = styles;
  return (
    <TouchableOpacity
      onPress={onPressFunc}
      disabled={isDisabled ? isDisabled : false}
      activeOpacity={activeOpacityOfTouchableOpacity}
      style={[
        container,
        {
          width: width ? width : "100%",
          height: height ? height : 50,
          backgroundColor: color ? color : primary,
          borderRadius: borderRadius ? borderRadius : 7,
        },
      ]}
    >
      {title === "loading" ? (
        <ButtonSpinner backGroundColor={white} />
      ) : (
        <View style={styles.innerContainer}>
          {iconPosition === "left" && icon}
          <Text
            style={[
              textStyles,
              { marginTop: icon ? 3 : 0, color: textColor ? textColor : white },
            ]}
          >
            {title}
          </Text>
          {iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyles: {
    fontFamily: family,
    fontSize: medium,
  },
});
