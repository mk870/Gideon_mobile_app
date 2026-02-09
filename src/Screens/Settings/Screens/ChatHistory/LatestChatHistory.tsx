import Screen from "@/src/Components/ScreenWrapper/Screen";
import StackScreen from "@/src/Components/ScreenWrapper/StackScreen";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import React from "react";
import { Text, View } from "react-native";

const LatestChatHistory: INoPropsReactComponent = () => {
  return (
    <Screen>
      <StackScreen>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Latest Chat History</Text>
        </View>
      </StackScreen>
    </Screen>
  );
};

export default LatestChatHistory;
