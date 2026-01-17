import {
    AntDesign,
    FontAwesome6,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import { IVoidFunc } from "@/src/GlobalTypes/Types";
import { colorScheme, purple, red, white } from "@/src/Theme/Colors";
import { family, large, medium } from "@/src/Theme/Font";
import { activeOpacityOfTouchableOpacity } from "@/src/Utils/Constants";
import ThemedText from "../ThemedText/ThemedText";

type Props = {
  handleCancel: IVoidFunc;
  message: string;
  isModalVisible: boolean;
  type?: "error" | "success" | "confirmation" | "warning";
  header?: string;
  handleConfirm?: IVoidFunc;
};

const MessageModal: React.FC<Props> = ({
  handleCancel,
  message,
  isModalVisible,
  type,
  header,
  handleConfirm,
}) => {
  const { width } = useWindowDimensions();
  const iconSize = 30;
  const color =
    type === "success"
      ? "green"
      : type === "error"
      ? red
      : type === "confirmation"
      ? purple
      : "#e0b908";
  const { container, subContainer, headerText, row, btn } = styles;
  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={handleCancel}
      transparent
      animationType="fade"
    >
      <View
        style={[
          container,
          {
            backgroundColor: "#1b1b1cb3",
          },
        ]}
      >
        <View
          style={[
            subContainer,
            {
              width: width > 500 ? 420 : 250,
              backgroundColor: colorScheme.background,
              borderTopColor: color,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            {type === "success" && (
              <AntDesign name="check" size={iconSize} color={white} />
            )}
            {type === "confirmation" && (
              <MaterialIcons
                name="question-mark"
                size={iconSize}
                color={white}
              />
            )}
            {type === "error" && (
              <MaterialCommunityIcons
                name="window-close"
                size={iconSize}
                color={white}
              />
            )}
            {type === "warning" && (
              <FontAwesome6 name="exclamation" size={iconSize} color={white} />
            )}
          </View>
          <Text style={[headerText, { color: colorScheme.text }]}>
            {header}
          </Text>
          <ThemedText type="regular">{message}</ThemedText>
          {type !== "confirmation" && (
            <View style={row}>
              <TouchableOpacity
                style={[btn, { backgroundColor: color }]}
                onPress={handleCancel}
                activeOpacity={activeOpacityOfTouchableOpacity}
              >
                <Text style={styles.regulartext}>
                  {type === "success" ? "continue" : "okay"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {type === "confirmation" && (
            <View style={styles.confirmationBtnContainer}>
              <TouchableOpacity
                style={[styles.confirmationBtn, { backgroundColor: color }]}
                onPress={handleConfirm}
                activeOpacity={activeOpacityOfTouchableOpacity}
              >
                <Text style={styles.regulartext}>yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationBtn, { backgroundColor: "gray" }]}
                onPress={handleCancel}
                activeOpacity={activeOpacityOfTouchableOpacity}
              >
                <Text style={styles.regulartext}>no</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  subContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    paddingTop: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderTopWidth: 3,
  },
  iconContainer: {
    position: "absolute",
    top: -25,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: family,
    fontSize: large,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    height: 40,
    borderRadius: 5,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  confirmationBtn: {
    width: "40%",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  regulartext: {
    fontFamily: family,
    fontSize: medium,
    color: white,
  },
});
