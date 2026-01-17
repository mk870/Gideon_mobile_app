import { red } from "@/src/Theme/Colors";
import { family, small } from "@/src/Theme/Font";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  subContainer: {
    gap: 10,
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  errorContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: -5,
  },
  errorText: {
    color: red,
    fontFamily: family,
    fontSize: small,
  },
  btnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
