import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import error from "@/src/Components/Lotties/error.json";
import { IVoidFunc } from "@/src/GlobalTypes/Types";
import Screen from "../ScreenWrapper/Screen";
import {
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  BUTTON_MAX_WIDTH,
} from "@/src/Utils/Constants";
import CustomButton from "../Buttons/Custom/CustomButton";
import { green, white } from "@/src/Theme/Colors";

type Props = {
  retryFunc: IVoidFunc;
};

const HttpError: React.FC<Props> = ({ retryFunc }) => {
  const { width } = useWindowDimensions();
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <LottieView
              source={error}
              autoPlay
              loop
              style={{
                height: 310,
                width: 310,
              }}
            />
          </View>
          <View
            style={[
              styles.btnContainer,
              {
                width:
                  width > BUTTON_SIZE_SCREEN_BREAK_POINT
                    ? BUTTON_MAX_WIDTH
                    : "100%",
              },
            ]}
          >
            <CustomButton
              color={green}
              title="retry"
              onPressFunc={retryFunc}
              iconPosition="left"
              icon={<Ionicons name="reload" size={20} color={white} />}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default HttpError;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  btnContainer: {
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    marginTop: 40,
  },
  btn: {
    width: "100%",
    backgroundColor: "green",
    height: 45,
    borderRadius: 7,
  },
});
