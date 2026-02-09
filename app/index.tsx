/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";

import Screen from "@/src/Components/ScreenWrapper/Screen";
import ScreenSpinner from "@/src/Components/Spinners/ScreenSpinner";
import { INoPropsReactComponent } from "@/src/GlobalTypes/Types";

import { IUser } from "@/src/GlobalTypes/User";
import useUpdateUser from "@/src/Hooks/useUpdateUser";
import { useAppDispatch, useAppSelector } from "@/src/Redux/Hooks/Config";
import { addAccessToken, addDeviceCode } from "@/src/Redux/Slices/UserSlice";
import { backEndUrl, expoSecureValueKeyNames } from "@/src/Utils/Constants";
import { getSecureValue } from "@/src/Utils/Func";

const Index: INoPropsReactComponent = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user.value);
  useUpdateUser(userData);

  const initialCheckAndBackendConnection = async () => {
    const accessTokenValue = await getSecureValue(
      expoSecureValueKeyNames.accessToken,
    );
    const deviceCodeValue = await getSecureValue(
      expoSecureValueKeyNames.deviceCode,
    );
    if (deviceCodeValue) {
      dispatch(addDeviceCode(deviceCodeValue));
    } else {
      router.replace("/login");
    }
    if (accessTokenValue) {
      dispatch(addAccessToken(accessTokenValue));
      const decoded: JwtPayload = jwtDecode(accessTokenValue);
      const currentDate = new Date();
      if (decoded.exp) {
        if (decoded.exp * 1000 > currentDate.getTime()) {
          if (!accessToken) {
            try {
              const res = await axios.get(`${backEndUrl}/users/email`, {
                headers: {
                  Authorization: `Bearer ${JSON.parse(accessTokenValue)}`,
                },
              });
              setUserData(res.data.response);
            } catch (error: any) {
              if (error.response?.data?.error !== "") {
                console.log(error.response?.data?.error);
              } else console.log("Something went wrong", error);
            } finally {
              router.replace("/voice");
            }
          } else {
            dispatch(addAccessToken(accessTokenValue));
            router.replace("/voice");
          }
        } else {
          router.replace("/login");
        }
      }
    } else {
      router.replace("/login");
    }
  };

  useEffect(() => {
    initialCheckAndBackendConnection();
  }, []);

  return (
    <Screen>
      <StatusBar style={"light"} />
      <ScreenSpinner />
    </Screen>
  );
};

export default Index;
