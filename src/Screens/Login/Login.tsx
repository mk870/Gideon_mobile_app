import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
import ThemedText from "@/src/Components/ThemedText/ThemedText";
import { INoPropsReactComponent, IVoidFunc } from "@/src/GlobalTypes/Types";
import { IUserLogin, IUserLoginResponse } from "@/src/GlobalTypes/User";
import useUpdateUser from "@/src/Hooks/useUpdateUser";
import { loginHttpFunc } from "@/src/HttpServices/Mutations/Auth/AuthHttpFuncs";
import { useAppDispatch } from "@/src/Redux/Hooks/Config";
import { addDeviceCode } from "@/src/Redux/Slices/UserSlice";
import { gray, red } from "@/src/Theme/Colors";
import {
  BUTTON_MAX_WIDTH,
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  expoSecureValueKeyNames,
  MAX_INPUT_WIDTH,
  SCREEN_BREAK_POINT,
} from "@/src/Utils/Constants";
import {
  emailValidator,
  passwordGuideLines,
  passwordValidator,
  saveSecureValue,
} from "@/src/Utils/Func";
import { styles } from "./styles";

const {
  inputWrapper,
  errorContainer,
  errorText,
  forgotPasswordText,
  forgotPasswordWrapper,
  registerContainer,
  guidelineHeaderText,
  btnWrapper,
  sectionTwoWrapper,
  linkText,
} = styles;

const Login: INoPropsReactComponent = () => {
  const { width } = useWindowDimensions();
  const getDeviceTypeString = (
    deviceType: Device.DeviceType | null,
  ): string => {
    if (deviceType === null) return "Unknown";

    switch (deviceType) {
      case Device.DeviceType.PHONE:
        return "Phone";
      case Device.DeviceType.TABLET:
        return "Tablet";
      case Device.DeviceType.DESKTOP:
        return "Desktop";
      case Device.DeviceType.TV:
        return "TV";
      default:
        return "Unknown";
    }
  };
  const [loginUserData, setLoginUserData] = useState<IUserLogin>({
    email: "",
    password: "",
    device: {
      name: Device.deviceName || "Unknown",
      type: getDeviceTypeString(Device.deviceType),
      modelName: Device.modelName || "Unknown",
      manufacturer: Device.manufacturer || "Unknown",
      osVersion: Device.osVersion || "Unknown",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [userData, setUserData] = useState<IUserLoginResponse | null>(null);
  const [isPasswordValidationError, setIsPasswordValidationError] =
    useState<boolean>(false);
  const [isEmailValidationError, setIsEmailValidationError] =
    useState<boolean>(false);
  const router = useRouter();
  useUpdateUser(userData);
  const dispatch = useAppDispatch();

  const loginMutation = useMutation<
    AxiosResponse<{ response: IUserLoginResponse }>,
    AxiosError,
    IUserLogin
  >({
    mutationFn: loginHttpFunc,
    onSuccess: async (data) => {
      try {
        await saveSecureValue(
          expoSecureValueKeyNames.accessToken,
          JSON.stringify(data.data.response.accessToken),
        );
        await saveSecureValue(
          expoSecureValueKeyNames.deviceCode,
          JSON.stringify(data.data.response.deviceCode),
        );
        setUserData(data.data.response);
        dispatch(addDeviceCode(data.data.response.deviceCode));
        router.dismissAll();
        router.replace("/voice");
      } catch (error) {
        console.log("accessToken error ", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setLoginError(error.response?.data?.error);
      } else setLoginError("Something went wrong");
    },
    onSettled: () => {
      setIsLoading(false);
      setLoginUserData({ ...loginUserData, email: "", password: "" });
    },
  });

  const handlePost: IVoidFunc = () => {
    if (!isEmailValidationError && !isPasswordValidationError) {
      setIsLoading(true);
      if (loginUserData.email !== "" && loginUserData.password !== "") {
        loginMutation.mutate(loginUserData);
      } else if (loginUserData.email === "" && loginUserData.password !== "") {
        setIsEmailValidationError(true);
        setIsLoading(false);
      } else if (loginUserData.email !== "" && loginUserData.password === "") {
        setIsPasswordValidationError(true);
        setIsLoading(false);
      } else if (loginUserData.email === "" && loginUserData.password === "") {
        setIsEmailValidationError(true);
        setIsPasswordValidationError(true);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (loginUserData.password !== "") {
      passwordValidator(setIsPasswordValidationError, loginUserData.password);
    } else {
      setIsPasswordValidationError(false);
    }
  }, [loginUserData.password]);

  useEffect(() => {
    if (loginUserData.email !== "") {
      emailValidator(setIsEmailValidationError, loginUserData.email);
    } else {
      setIsEmailValidationError(false);
    }
  }, [loginUserData.email]);

  return (
    <Screen>
      <StatusBar style={"light"} />
      <StackScreen>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={[
              inputWrapper,
              { width: width > SCREEN_BREAK_POINT ? MAX_INPUT_WIDTH : "95%" },
            ]}
          >
            <ThemedText type="header" styles={{ marginBottom: 10 }}>
              Welcome back!
            </ThemedText>
            <InputField
              textValue={loginUserData.email}
              placeHolder="email"
              width={"100%"}
              handleOnChangeText={(e) =>
                setLoginUserData({ ...loginUserData, email: e })
              }
              height={50}
              contentType="emailAddress"
              type="emailAddress"
              label="Email"
              backgroundColor="transparent"
              borderColor={isEmailValidationError ? red : gray}
            />
            {isEmailValidationError && (
              <View style={errorContainer}>
                <Text style={errorText}>please enter valid email address</Text>
              </View>
            )}
            <InputField
              textValue={loginUserData.password}
              placeHolder="password"
              width={"100%"}
              handleOnChangeText={(e) =>
                setLoginUserData({ ...loginUserData, password: e })
              }
              height={50}
              contentType="password"
              type="password"
              label="Password"
              backgroundColor="transparent"
              borderColor={isPasswordValidationError ? red : gray}
            />
            <View style={forgotPasswordWrapper}>
              <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
                <Text style={forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            {isPasswordValidationError && (
              <View style={errorContainer}>
                <Text style={guidelineHeaderText}>Password Guideines:</Text>
                {passwordGuideLines.map((guideline: string) => (
                  <Text key={guideline} style={errorText}>
                    {guideline}
                  </Text>
                ))}
              </View>
            )}
            <View style={sectionTwoWrapper}>
              <View style={registerContainer}>
                <ThemedText type="regular">
                  you do not have an account?{" "}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push("/register")}
                  disabled={isLoading}
                  style={styles.linkContainer}
                >
                  <Text style={linkText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  btnWrapper,
                  {
                    width:
                      width > BUTTON_SIZE_SCREEN_BREAK_POINT
                        ? BUTTON_MAX_WIDTH
                        : "100%",
                  },
                ]}
              >
                <CustomButton
                  title={isLoading ? "loading" : "Login"}
                  onPressFunc={handlePost}
                  isDisabled={isLoading}
                />
              </View>
            </View>
          </View>
          <MessageModal
            handleCancel={() => setLoginError("")}
            message={loginError}
            isModalVisible={loginError ? true : false}
            type="error"
            header="Login Failed"
          />
        </ScrollView>
      </StackScreen>
    </Screen>
  );
};

export default Login;
