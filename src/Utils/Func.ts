import * as Device from 'expo-device';
import * as SecureStore from "expo-secure-store";

export const saveSecureValue = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecureValue = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  return result;
};

export const getDeviceTypeString = (): string => {
  switch (Device.deviceType) {
    case Device.DeviceType.PHONE:
      return 'phone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.TV:
      return 'tv';
    default:
      return 'unknown';
  }
}

export const passwordValidator: (
  setIsPasswordValidationError: React.Dispatch<React.SetStateAction<boolean>>,
  passwordValue: string | undefined
) => void = (setIsPasswordValidationError, passwordValue) => {
  if (passwordValue) {
    const regexPasswordValidator = new RegExp(
      "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (regexPasswordValidator.test(passwordValue)) {
      setIsPasswordValidationError(false);
    } else {
      setIsPasswordValidationError(true);
    }
  }
};

export const generateRandomSixDigitNumber = () => {
  let result = 100000 + Math.floor(Math.random() * 900000);
  return result.toString();
};

export const emailValidator: (
  setIsEmailValidationError: React.Dispatch<React.SetStateAction<boolean>>,
  emailValue: string | undefined
) => void = (setIsEmailValidationError, emailValue) => {
  if (emailValue) {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        emailValue
      )
    ) {
      setIsEmailValidationError(true);
    } else {
      setIsEmailValidationError(false);
    }
  }
};

export const passwordGuideLines = [
  "longer than 8 characters",
  "have atleast 1 special character",
  "have atleast 1 number",
  "have atleast 1 capital letter",
];

export const shortenString = (text: string, maxNumberOfWords: number) => {
  const maxWords = maxNumberOfWords + 1;
  if (text.length > maxNumberOfWords)
    return `${text.substring(0, maxWords)}...`;
  else return text;
};

export const cleanTextSnippets = (snippet: string) => {
  if (snippet) return snippet.replace(/(https?|ftp):\/\/[.[a-zA-Z0-9/-]+/, " ");
  else return "";
};
export const numberToString = (value: number) => {
  if (typeof value === "number") return value.toString();
  else return value;
};
export const stringToNumber = (value: string) => {
  if (typeof value === "string") return Number(value);
  else return value;
};
export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const processLocalQueryParam = (
  queryParam: string | string[] | undefined
) => {
  return queryParam ? (Array.isArray(queryParam) ? "" : queryParam) : "";
};