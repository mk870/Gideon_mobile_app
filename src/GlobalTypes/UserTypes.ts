export type IUser = {
    givenName: string;
    familyName: string;
    id: number;
    role:"user"|"admin"
    accessToken: string;
  };