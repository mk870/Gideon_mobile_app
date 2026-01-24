import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import CustomButton from "@/src/Components/Buttons/Custom/CustomButton";
import InputField from "@/src/Components/InputField/InputField";
import ServerError from "@/src/Components/Modals/MessageModal";
import Screen from "@/src/Components/ScreenWrapper/Screen";
import StackScreen from "@/src/Components/ScreenWrapper/StackScreen";
import ThemedText from "@/src/Components/ThemedText/ThemedText";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import { createVerificationCodeForSecurityHttpFunc } from "@/src/HttpServices/Mutations/Auth/AuthHttpFuncs";
import { gray, red } from "@/src/Theme/Colors";
import {
  BUTTON_MAX_WIDTH,
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  MAX_INPUT_WIDTH,
  SCREEN_BREAK_POINT,
} from "@/src/Utils/Constants";
import { emailValidator } from "@/src/Utils/Func";
import { styles } from "./Styles";

const ForgotPassword: INoPropsReactComponent = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [httpError, setHttpError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailValidationError, setIsEmailValidationError] =
    useState<boolean>(false);
  useEffect(() => {
    if (email !== "") {
      emailValidator(setIsEmailValidationError, email);
    } else {
      setIsEmailValidationError(false);
    }
  }, [email]);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: createVerificationCodeForSecurityHttpFunc,
    onSuccess(data) {
      router.push({
        pathname: `/verification/[id]`,
        params: {
          isNewUser: "no",
          id: data.data.userId.toString(),
        },
      });
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setHttpError(error.response?.data?.error);
      } else setHttpError("Something went wrong");
    },
    onSettled: () => {
      setEmail(undefined);
      setIsLoading(false);
    },
  });

  const handlePost = () => {
    if (email && !isEmailValidationError) {
      setIsLoading(true);
      forgotPasswordMutation.mutate({ email });
    }
  };
  return (
    <Screen>
      <StackScreen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={[
              styles.subContainer,
              { width: width > SCREEN_BREAK_POINT ? MAX_INPUT_WIDTH : "100%" },
            ]}
          >
            <ThemedText type="header" styles={styles.header}>
              Forgot your password?
            </ThemedText>
            <ThemedText type="regular">
              Enter your email address, and we will send you a verification code
              to change your password.
            </ThemedText>
            <InputField
              textValue={email}
              placeHolder="email"
              width={"100%"}
              handleOnChangeText={(e) => setEmail(e)}
              height={50}
              contentType="emailAddress"
              type="emailAddress"
              label="Email"
              borderColor={isEmailValidationError ? red : gray}
              backgroundColor="transparent"
            />
            {isEmailValidationError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  please enter valid email address
                </Text>
              </View>
            )}
            <View
              style={[
                styles.btnWrapper,
                {
                  width:
                    width > BUTTON_SIZE_SCREEN_BREAK_POINT
                      ? BUTTON_MAX_WIDTH
                      : "100%",
                },
              ]}
            >
              <CustomButton
                title={isLoading ? "loading" : "Verify"}
                onPressFunc={handlePost}
                isDisabled={isLoading ? true : false}
              />
            </View>
          </View>
          {httpError && (
            <ServerError
              type="error"
              header="Email failed"
              handleCancel={() => setHttpError("")}
              message={httpError}
              isModalVisible={httpError ? true : false}
            />
          )}
        </ScrollView>
      </StackScreen>
    </Screen>
  );
};

export default ForgotPassword;
