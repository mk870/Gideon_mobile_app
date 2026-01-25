import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/location";

export const userLocationRoutes = {
  createGetByIdAndGetAllUserLocations: `${backEndUrl}${baseRouteName}`,
  getUserLocationByUsername: `${backEndUrl}${baseRouteName}/name`,
  getUserLocationByUserId: `${backEndUrl}${baseRouteName}/user`,
  reverseGeocodeLocation: `${backEndUrl}${baseRouteName}/reverse-geocoding`,
};
