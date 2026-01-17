import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import CustomButton from "@/src/Components/Buttons/Custom/CustomButton";
import InputField from "@/src/Components/InputField/InputField";
import MessageModal from "@/src/Components/Modals/MessageModal";
import Screen from "@/src/Components/ScreenWrapper/Screen";
import StackScreen from "@/src/Components/ScreenWrapper/StackScreen";
import ButtonSpinner from "@/src/Components/Spinners/ButtonSpinner";
import ThemedText from "@/src/Components/ThemedText/ThemedText";
import { INoPropsReactComponent, IStringOrNull } from "@/src/GlobalTypes/Types";
import {
  resendVerificationCodeHttpFunc,
  verificationCodeForSecurityHttpFunc,
  verifyCodeForUserRegistrationHttpFunc,
} from "@/src/HttpServices/Mutations/Auth/AuthHttpFuncs";
import { gray, red } from "@/src/Theme/Colors";
import {
  BUTTON_MAX_WIDTH,
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  MAX_INPUT_WIDTH,
  SCREEN_BREAK_POINT,
} from "@/src/Utils/Constants";
import { processLocalQueryParam } from "@/src/Utils/Func";
import { Styles } from "./Styles";

const Verification: INoPropsReactComponent = () => {
  const { id, isNewUser } = useLocalSearchParams();
  const processedIsNewUser = processLocalQueryParam(isNewUser);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [
    showResendVerificationCodeSuccess,
    setShowResendVerificationCodeSuccess,
  ] = useState<boolean>(false);
  const [isVerificationLoading, setIsVerificationLoading] =
    useState<boolean>(false);
  const [isVerificationSuccessful, setIsVerificationSuccesful] =
    useState<boolean>(false);
  const [isResendLoading, setIsResendLoading] = useState<boolean>(false);
  const [typingError, setTypingError] = useState<IStringOrNull>(null);
  const [httpError, setHttpError] = useState<string>("");
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (verificationCode && verificationCode.length < 6)
      setTypingError("verification code should be 6 digits");
    else setTypingError(null);
  }, [verificationCode]);

  useEffect(() => {
    if (showResendVerificationCodeSuccess)
      setTimeout(() => setShowResendVerificationCodeSuccess(false), 3000);
  }, [showResendVerificationCodeSuccess]);

  const verifyCodeForSecurityMutation = useMutation({
    mutationFn: verificationCodeForSecurityHttpFunc,
    onSuccess(data) {
      router.push({
        pathname: "/resetPassword/[id]",
        params: {
          id: data.data.userId.toFixed(),
        },
      });
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setHttpError(error.response?.data?.error);
      } else setHttpError("Something went wrong");
    },
    onSettled: () => {
      setVerificationCode("");
      setIsVerificationLoading(false);
    },
  });

  const verifyCodeForNativeUserRegistrationMutation = useMutation({
    mutationFn: verifyCodeForUserRegistrationHttpFunc,
    onSuccess(data) {
      console.log(data.data.response);
      router.replace("/login");
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setHttpError(error.response?.data?.error);
      } else setHttpError("Something went wrong");
    },
    onSettled: () => {
      setVerificationCode("");
      setIsVerificationLoading(false);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationCodeHttpFunc,
    onSuccess(_data) {
      setShowResendVerificationCodeSuccess(true);
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setHttpError(error.response?.data?.error);
      } else setHttpError("Something went wrong");
    },
    onSettled: () => {
      setIsResendLoading(false);
    },
  });

  const handleVerification = () => {
    if (!typingError && verificationCode) {
      setIsVerificationLoading(true);
      if (processedIsNewUser === "no") {
        verifyCodeForSecurityMutation.mutate({
          userId: id ? +id : 0,
          verificationCode: +verificationCode,
        });
      } else {
        verifyCodeForNativeUserRegistrationMutation.mutate({
          userId: id ? +id : 0,
          verificationCode: +verificationCode,
        });
      }
    }
  };

  const handleResendCode = () => {
    setIsResendLoading(true);
    resendMutation.mutate(id ? +id : 0);
  };

  const handleAlertCancel = () => {
    setHttpError("");
  };

  const handleSuccessModalClose = () => {
    setIsVerificationSuccesful(false);
    router.dismissAll();
    router.replace("/voice");
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
              Styles.container,
              { width: width > SCREEN_BREAK_POINT ? MAX_INPUT_WIDTH : "100%" },
            ]}
          >
            <ThemedText
              type="header"
              styles={{ textAlign: "center", marginTop: 10 }}
            >
              Code Verification
            </ThemedText>
            <ThemedText type="regular">
              Please enter your verification code
            </ThemedText>
            <InputField
              width={"100%"}
              height={50}
              handleOnChangeText={(e) => setVerificationCode(e)}
              textValue={verificationCode}
              label="Code"
              type="number"
              handleOnEnter={handleVerification}
              contentType="none"
              placeHolder=""
              borderColor={typingError ? red : gray}
            />
            {typingError && <Text style={Styles.errorText}>{typingError}</Text>}
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={isVerificationLoading || isResendLoading ? true : false}
              style={Styles.linkContainer}
            >
              {isResendLoading ? (
                <ButtonSpinner />
              ) : (
                <Text style={Styles.resendText}>Resend Code</Text>
              )}
            </TouchableOpacity>
            <View
              style={[
                Styles.btnWrapper,
                {
                  width:
                    width > BUTTON_SIZE_SCREEN_BREAK_POINT
                      ? BUTTON_MAX_WIDTH
                      : "100%",
                },
              ]}
            >
              <CustomButton
                title={isVerificationLoading ? "loading" : "Verify"}
                onPressFunc={handleVerification}
                isDisabled={
                  isVerificationLoading || isResendLoading ? true : false
                }
              />
            </View>
          </View>
          {httpError && (
            <MessageModal
              handleCancel={handleAlertCancel}
              message={httpError}
              isModalVisible={httpError ? true : false}
              type="error"
              header="Server Error"
            />
          )}
          <MessageModal
            isModalVisible={showResendVerificationCodeSuccess}
            message="please check your email for verification code"
            type="success"
            header="Email Sent!"
            handleCancel={() => setShowResendVerificationCodeSuccess(false)}
          />
          <MessageModal
            isModalVisible={isVerificationSuccessful}
            message={
              processedIsNewUser === "no"
                ? "your verification was successful, you may continue."
                : "congratulations, your account has been successfully created, welcome to Sleek Space."
            }
            type="success"
            header={
              processedIsNewUser === "no"
                ? "Verification Successful!"
                : "Account Created!"
            }
            handleCancel={handleSuccessModalClose}
          />
        </ScrollView>
      </StackScreen>
    </Screen>
  );
};

export default Verification;
