export type IUserLogin = {
  email: string;
  password: string;
  device: IDeviceUserLogin;
};

export type IUserRegistration = {
  givenName: string;
  familyName: string;
  email: string;
  weight: string;
  height: string;
  contactNumber: string;
  password: string;
};

export type IUserRegistrationResponse = {
  userId: number;
  message: string;
};

export type IDeviceUserLogin = {
  name: string;
  type: string;
  modelName: string;
  manufacturer: string;
  osVersion: string;
};

export type IUserResetPassword = {
  userId: number;
  newPassword: string;
};

export type IUserVerificationData = {
  userId: number;
  verificationCode: number;
};

export type IUserCreateVerificationCode = {
  email: string;
};

export type ILocationResponse = {
  id: number;
  latitude: string;
  longitude: string;
  surburb: string;
  city: string;
  province: string;
  country: string;
  countryCode: string;
};

export type IUser = {
  id: number;
  givenName: string;
  familyName: string;
  email: string;
  weight: string;
  height: string;
  contactNumber: string;
  accessToken: string;
  deviceCode: string;
  webSocketToken: string;
  location: ILocationResponse | null;
};

export type IUserLoginResponse = {
  id: number;
  givenName: string;
  familyName: string;
  email: string;
  weight: string;
  height: string;
  contactNumber: string;
  accessToken: string;
  webSocketToken: string;
  location: ILocationResponse;
  deviceCode: string;
};

export interface IUserUpdate {
  givenName: string;
  familyName: string;
  email: string;
  weight: string;
  height: string;
  contactNumber: string;
}
