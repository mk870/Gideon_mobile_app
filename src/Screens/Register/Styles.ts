import { primary, red } from "@/src/Theme/Colors";
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
  },
  registerLink: {
    color: primary,
    fontFamily: family,
    fontSize: small,
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
