import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";
import { IUserRegistration } from "@/src/GlobalTypes/User";
import { registerHttpFunc } from "@/src/HttpServices/Mutations/Auth/AuthHttpFuncs";
import { colorScheme, gray, red } from "@/src/Theme/Colors";
import {
  BUTTON_MAX_WIDTH,
  BUTTON_SIZE_SCREEN_BREAK_POINT,
  MAX_INPUT_WIDTH,
  SCREEN_BREAK_POINT,
} from "@/src/Utils/Constants";
import {
  emailValidator,
  passwordGuideLines,
  passwordValidator,
} from "@/src/Utils/Func";
import { styles } from "./Styles";

const Register: INoPropsReactComponent = () => {
  const [signUpData, setSignUpData] = useState<IUserRegistration>({
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    contactNumber: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string>("");
  const [isPasswordValidationError, setIsPasswordValidationError] =
    useState<boolean>(false);
  const [isEmailValidationError, setIsEmailValidationError] =
    useState<boolean>(false);
  const [isGivenNameValidationError, setIsGivenNameValidationError] =
    useState<boolean>(false);
  const [isFamilyNameValidationError, setIsFamilyNameValidationError] =
    useState<boolean>(false);

  const handleOnChangeFirstName = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      givenName: value as string,
    });
  };

  const handleOnChangeLastName = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      familyName: value as string,
    });
  };

  const handleOnChangePassword = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      password: value as string,
    });
  };

  const handleOnChangeEmail = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      email: value as string,
    });
  };

  const handleOnChangeContactNumber = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      contactNumber: value as string,
    });
  };

  const handleOnChangeHeight = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      height: value as string,
    });
  };

  const handleOnChangeWeight = (value: string | undefined) => {
    setSignUpData({
      ...signUpData,
      weight: value as string,
    });
  };

  const registrationMutation = useMutation({
    mutationFn: registerHttpFunc,
    onSuccess(data) {
      setUserId(data.data.userId);
      setIsRegistrationSuccessful(true);
    },
    onError(error: any) {
      if (error.response?.data?.error !== "") {
        setRegistrationError(error.response?.data?.error);
      } else setRegistrationError("Something went wrong");
    },
    onSettled: () => {
      setSignUpData({
        ...signUpData,
        email: "",
        password: "",
        givenName: "",
        familyName: "",
      });
      setIsLoading(false);
    },
  });

  const handleSignUp = () => {
    if (
      !isEmailValidationError &&
      !isPasswordValidationError &&
      !isGivenNameValidationError &&
      !isFamilyNameValidationError
    ) {
      setIsLoading(true);
      if (
        signUpData.email !== "" &&
        signUpData.password !== "" &&
        signUpData.givenName !== "" &&
        signUpData.familyName !== "" &&
        signUpData.contactNumber !== "" &&
        signUpData.height !== "" &&
        signUpData.weight !== ""
      ) {
        registrationMutation.mutate(signUpData);
      } else if (
        signUpData.email === "" &&
        signUpData.password !== "" &&
        signUpData.givenName !== "" &&
        signUpData.familyName !== "" &&
        signUpData.contactNumber !== "" &&
        signUpData.height !== "" &&
        signUpData.weight !== ""
      ) {
        setIsEmailValidationError(true);
        setIsLoading(false);
      } else if (
        signUpData.email !== "" &&
        signUpData.password === "" &&
        signUpData.givenName !== "" &&
        signUpData.familyName !== "" &&
        signUpData.contactNumber !== "" &&
        signUpData.height !== "" &&
        signUpData.weight !== ""
      ) {
        setIsPasswordValidationError(true);
        setIsLoading(false);
      } else if (
        signUpData.email !== "" &&
        signUpData.password !== "" &&
        signUpData.givenName === "" &&
        signUpData.familyName !== "" &&
        signUpData.contactNumber !== "" &&
        signUpData.height !== "" &&
        signUpData.weight !== ""
      ) {
        setIsGivenNameValidationError(true);
        setIsLoading(false);
      } else if (
        signUpData.email !== "" &&
        signUpData.password !== "" &&
        signUpData.givenName !== "" &&
        signUpData.familyName === "" &&
        signUpData.contactNumber !== "" &&
        signUpData.height !== "" &&
        signUpData.weight !== ""
      ) {
        setIsFamilyNameValidationError(true);
        setIsLoading(false);
      } else if (
        signUpData.email === "" &&
        signUpData.password === "" &&
        signUpData.givenName === "" &&
        signUpData.familyName === "" &&
        signUpData.contactNumber === "" &&
        signUpData.height === "" &&
        signUpData.weight === ""
      ) {
        setIsEmailValidationError(true);
        setIsPasswordValidationError(true);
        setIsFamilyNameValidationError(true);
        setIsGivenNameValidationError(true);
        setIsLoading(false);
      } else if (
        signUpData.email === "" ||
        signUpData.password === "" ||
        signUpData.givenName === "" ||
        signUpData.familyName === ""
      ) {
        if (signUpData.email === "") setIsEmailValidationError(true);
        if (signUpData.password === "") setIsPasswordValidationError(true);
        if (signUpData.givenName === "") setIsGivenNameValidationError(true);
        if (signUpData.familyName === "") setIsFamilyNameValidationError(true);
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    if (signUpData.password !== "") {
      passwordValidator(setIsPasswordValidationError, signUpData.password);
    } else {
      setIsPasswordValidationError(false);
    }
  }, [signUpData.password]);

  useEffect(() => {
    if (signUpData.email !== "") {
      emailValidator(setIsEmailValidationError, signUpData.email);
    } else {
      setIsEmailValidationError(false);
    }
  }, [signUpData.email]);

  useEffect(() => {
    if (signUpData.givenName !== "" || !signUpData.givenName) {
      if (signUpData.givenName && signUpData.givenName.length < 4) {
        setIsGivenNameValidationError(true);
      } else {
        setIsGivenNameValidationError(false);
      }
    } else {
      setIsGivenNameValidationError(false);
    }
  }, [signUpData.givenName]);

  useEffect(() => {
    if (signUpData.familyName !== "") {
      if (signUpData.familyName && signUpData.familyName.length < 4) {
        setIsFamilyNameValidationError(true);
      } else {
        setIsFamilyNameValidationError(false);
      }
    } else {
      setIsFamilyNameValidationError(false);
    }
  }, [signUpData.familyName]);

  const handleCloseSuccesModal = () => {
    setIsRegistrationSuccessful(false);
    router.push({
      pathname: `/verification/[id]`,
      params: {
        isNewUser: "yes",
        id: userId ? userId.toString() : "",
      },
    });
  };

  const {
    container,
    inputWrapper,
    btnWrapper,
    errorContainer,
    errorText,
    guidelineHeaderText,
    registerContainer,
    registerLink,
    sectionTwoWrapper,
  } = styles;
  const { width } = useWindowDimensions();
  return (
    <Screen>
      <StackScreen>
        <ScrollView
          style={container}
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
            <ThemedText type="header">Registration</ThemedText>
            <InputField
              textValue={signUpData.givenName}
              placeHolder="given name"
              width={"100%"}
              handleOnChangeText={handleOnChangeFirstName}
              height={50}
              contentType="givenName"
              type="givenName"
              label="Given Name"
              backgroundColor="transparent"
              borderColor={isGivenNameValidationError ? red : gray}
            />
            {isGivenNameValidationError && (
              <View style={errorContainer}>
                <Text style={errorText}>please enter atleast 4 characters</Text>
              </View>
            )}
            <InputField
              textValue={signUpData.familyName}
              placeHolder="family name"
              width={"100%"}
              handleOnChangeText={handleOnChangeLastName}
              height={50}
              contentType="familyName"
              type="familyName"
              label="Family Name"
              backgroundColor="transparent"
              borderColor={isFamilyNameValidationError ? red : gray}
            />
            {isFamilyNameValidationError && (
              <View style={errorContainer}>
                <Text style={errorText}>please enter atleast 4 characters</Text>
              </View>
            )}
            <InputField
              textValue={signUpData.email}
              placeHolder="email"
              width={"100%"}
              handleOnChangeText={handleOnChangeEmail}
              height={50}
              contentType="emailAddress"
              type="emailAddress"
              label="Email"
              backgroundColor="transparent"
              borderColor={isEmailValidationError ? red : gray}
            />
            {isEmailValidationError && (
              <View style={errorContainer}>
                <Text style={errorText}>
                  please enter a valid email address
                </Text>
              </View>
            )}
            <InputField
              textValue={signUpData.contactNumber}
              placeHolder="contact number"
              width={"100%"}
              handleOnChangeText={handleOnChangeContactNumber}
              height={50}
              contentType="telephoneNumber"
              type="telephoneNumber"
              label="Contact Number"
              backgroundColor="transparent"
              borderColor={gray}
            />
            <InputField
              textValue={signUpData.height}
              placeHolder="height (in cm)"
              width={"100%"}
              handleOnChangeText={handleOnChangeHeight}
              height={50}
              contentType="none"
              type="height"
              label="Height"
              backgroundColor="transparent"
              borderColor={gray}
            />
            <InputField
              textValue={signUpData.weight}
              placeHolder="weight (in kg)"
              width={"100%"}
              handleOnChangeText={handleOnChangeWeight}
              height={50}
              contentType="none"
              type="weight"
              label="Weight"
              backgroundColor="transparent"
              borderColor={gray}
            />
            <InputField
              textValue={signUpData.password}
              placeHolder="password"
              width={"100%"}
              handleOnChangeText={handleOnChangePassword}
              height={50}
              contentType="password"
              type="password"
              label="Password"
              backgroundColor="transparent"
              borderColor={isPasswordValidationError ? red : gray}
            />
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
                  you already have an account?{" "}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={[
                    styles.linkContainer,
                    {
                      backgroundColor: colorScheme.darkGray,
                    },
                  ]}
                >
                  <Text style={registerLink}>Login</Text>
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
                  title={isLoading ? "loading" : "Register"}
                  onPressFunc={handleSignUp}
                  isDisabled={isLoading ? true : false}
                />
              </View>
            </View>
          </View>
          <MessageModal
            message={registrationError}
            handleCancel={() => setRegistrationError("")}
            isModalVisible={registrationError ? true : false}
            header="Registration Failed"
            type="error"
          />
          <MessageModal
            message={
              "please check your email for the verification code and finish setting up your account."
            }
            handleCancel={handleCloseSuccesModal}
            isModalVisible={isRegistrationSuccessful}
            header="Email Sent!"
            type="success"
          />
        </ScrollView>
      </StackScreen>
    </Screen>
  );
};

export default Register;
