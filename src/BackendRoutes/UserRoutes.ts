import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/user";

export const userRoutes = {
  getByIdDeleteAndGetAllUsers: `${backEndUrl}${baseRouteName}`,
  getUserByUsername: `${backEndUrl}${baseRouteName}/name`,
  getUserByEmail: `${backEndUrl}${baseRouteName}/email`,
};
