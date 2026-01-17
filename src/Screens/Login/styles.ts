import { colorScheme, primary, red } from "@/src/Theme/Colors";
import { family, medium, small } from "@/src/Theme/Font";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 12,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "red",
  },
  forgotPasswordWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: -5,
  },
  forgotPasswordText: {
    color: primary,
    fontFamily: family,
    fontSize: small,
  },
  errorContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: -5,
  },
  guidelineHeaderText: {
    color: red,
    fontFamily: family,
    fontSize: medium,
    marginBottom: 5,
  },
  errorText: {
    color: red,
    fontFamily: family,
    fontSize: small,
  },
  registerContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 20,
  },
  linkContainer: {
    height: 40,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: colorScheme.darkGray,
    marginTop: 10,
  },
  linkText: {
    color: primary,
    fontFamily: family,
    fontSize: medium,
  },
  sectionTwoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  btnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  socialsWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
