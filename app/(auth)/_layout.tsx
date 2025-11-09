import { Stack, useRouter } from "expo-router";
import React from "react";

import HeaderIcon from "@/src/Components/Navigation/HeaderIcon/HeaderIcon";
import { stackAnimation } from "@/src/Components/Navigation/Utils/Constants";
import StackWrapper from "@/src/HOCs/StackWrapper";
import { colorScheme } from "@/src/Theme/Colors";
import { family } from "@/src/Theme/Font";

const AuthStack = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleStyle: {
          fontFamily: family,
          color: colorScheme.text,
        },
        headerTitleAlign: "center",
        headerTransparent: true,
        headerLeft: () => (
          <HeaderIcon
            iconSize={24}
            iconName="arrow-back"
            onPressFunc={() => router.back()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          animation: stackAnimation,
          headerLeft: undefined,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          animation: stackAnimation,
        }}
      />
    </Stack>
  );
};

export default StackWrapper(AuthStack);
