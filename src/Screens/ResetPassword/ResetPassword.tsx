import CustomButton from "@/src/Components/Buttons/Custom/CustomButton";
import InputField from "@/src/Components/InputField/InputField";
import MessageModal from "@/src/Components/Modals/MessageModal";
import Screen from "@/src/Components/ScreenWrapper/Screen";
import ThemedText from "@/src/Components/ThemedText/ThemedText";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import { resetPasswordHttpFunc } from "@/src/HttpServices/Mutations/Auth/AuthHttpFuncs";
import { gray, red } from "@/src/Theme/Colors";
import {
    BUTTON_MAX_WIDTH,
    BUTTON_SIZE_SCREEN_BREAK_POINT,
    MAX_INPUT_WIDTH,
    SCREEN_BREAK_POINT,
} from "@/src/Utils/Constants";
import { passwordGuideLines, passwordValidator } from "@/src/Utils/Func";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { styles } from "./Styles";

const ResetPassword: INoPropsReactComponent = () => {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetPassWordSuccess, setResetPassWordSuccess] =
    useState<boolean>(false);
  const [resetPassWordError, setResetPassWordError] = useState<string>("");
  const [passwords, setPasswords] = useState<{
    password: string | undefined;
    confirmPassword: string | undefined;
  }>({
    password: "",
    confirmPassword: "",
  });
  const [isPasswordConfirmationError, setIsPasswordConfirmationError] =
    useState<boolean>(false);
  const [isPasswordValidationError, setIsPasswordValidationError] =
    useState<boolean>(false);

  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    if (passwords.password !== "") {
      passwordValidator(setIsPasswordValidationError, passwords.password);
    } else {
      setIsPasswordValidationError(false);
    }
  }, [passwords.password]);

  useEffect(() => {
    if (passwords.confirmPassword && passwords.password) {
      if (passwords.confirmPassword !== passwords.password)
        setIsPasswordConfirmationError(true);
      else setIsPasswordConfirmationError(false);
    } else setIsPasswordConfirmationError(false);
  }, [passwords.confirmPassword, passwords.password]);

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordHttpFunc,
    onSuccess(_data) {
      setResetPassWordSuccess(true);
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setResetPassWordError(error.response?.data?.error);
      } else setResetPassWordError("Something went wrong");
    },
    onSettled: () => {
      setPasswords({
        ...passwords,
        password: undefined,
        confirmPassword: undefined,
      });
      setIsLoading(false);
    },
  });

  const handleReset = () => {
    if (
      !isPasswordConfirmationError &&
      !isPasswordValidationError &&
      passwords.password &&
      passwords.confirmPassword
    ) {
      setIsLoading(true);
      resetPasswordMutation.mutate({
        userId: id ? +id : 0,
        newPassword: passwords.password,
      });
    }
  };

  const handlePasswordResetSuccessModalClose = () => {
    setResetPassWordSuccess(false);
    router.dismissAll();
    router.push(`/login`);
  };

  return (
    <Screen>
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
          <ThemedText
            type="header"
            styles={{ textAlign: "center", marginBottom: 10 }}
          >
            Reset Password
          </ThemedText>
          <ThemedText type="regular">Enter your new password</ThemedText>
          <InputField
            textValue={passwords.password}
            placeHolder="password"
            width={"100%"}
            handleOnChangeText={(e) =>
              setPasswords({ ...passwords, password: e })
            }
            height={50}
            contentType="password"
            type="password"
            label="Password"
            borderColor={isPasswordValidationError ? red : gray}
          />
          <InputField
            textValue={passwords.confirmPassword}
            placeHolder="confirm password"
            width={"100%"}
            handleOnChangeText={(e) =>
              setPasswords({ ...passwords, confirmPassword: e })
            }
            height={50}
            contentType="password"
            type="password"
            label="Confirm Password"
            borderColor={isPasswordValidationError ? red : gray}
          />
          {isPasswordConfirmationError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>passwords are not the same</Text>
            </View>
          )}
          {isPasswordValidationError && (
            <View style={styles.errorContainer}>
              <Text style={styles.guidelineHeaderText}>
                Password Guideines:
              </Text>
              {passwordGuideLines.map((guideline: string) => (
                <Text key={guideline} style={styles.errorText}>
                  {guideline}
                </Text>
              ))}
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
              title={isLoading ? "loading" : "Reset Password"}
              onPressFunc={handleReset}
              isDisabled={isLoading ? true : false}
            />
          </View>
        </View>
        <MessageModal
          isModalVisible={resetPassWordError ? true : false}
          message={resetPassWordError}
          handleCancel={() => setResetPassWordError("")}
          type="error"
          header="Password Reset Failed"
        />
        <MessageModal
          isModalVisible={resetPassWordSuccess}
          message={
            "your password has been successfully updated, make sure you don't lose it."
          }
          handleCancel={handlePasswordResetSuccessModalClose}
          type="success"
          header="Password Reset Successful"
        />
      </ScrollView>
    </Screen>
  );
};

export default ResetPassword;
