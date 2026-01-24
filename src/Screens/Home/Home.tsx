import { useRouter } from "@/.expo/types/router";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import React from "react";
import { Text, View } from "react-native";

const Home: INoPropsReactComponent = () => {
  const route = useRouter();
  route.replace("/settings/contacts");
  return (
    <View>
      <Text>Hometyu</Text>
    </View>
  );
};

export default Home;
