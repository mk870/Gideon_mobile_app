import { primary } from "@/src/Theme/Colors";
import { family, medium, small } from "@/src/Theme/Font";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    gap: 20,
    paddingBottom: 20,
  },
  lottieContainer: {
    alignSelf: "center",
  },
  optionsDetailsWrapper: {
    gap: 10,
  },
  optionsContainer: {
    gap: 10,
    borderRadius: 10,
  },
  option: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 15,
  },
  optionIconText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    height: 45,
  },
  optionText: {
    fontFamily: family,
    fontSize: small,
  },
  headerText: {
    fontFamily: family,
    fontSize: medium,
    fontWeight: "bold",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
  },
  createAccountBtn: {
    borderWidth: 2,
    borderColor: primary,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 7,
  },
  createAccountText: {
    fontFamily: family,
    color: primary,
    fontSize: medium,
  },
});
