import { StyleSheet } from "react-native";

import { primary, red } from "@/src/Theme/Colors";
import { family, small } from "@/src/Theme/Font";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
  errorText: {
    color: red,
    fontFamily: family,
    fontSize: small,
    marginTop: -5,
  },
  resendText: {
    color: primary,
    fontFamily: family,
    fontSize: small,
  },
  linkContainer: {
    paddingVertical: 8,
    width: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    alignSelf: "center",
  },
  btnWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "center",
  },
});
