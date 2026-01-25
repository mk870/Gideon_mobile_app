import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/contacts";

export const userContactsRoutes = {
  createGetByIdDeleteAndGetAllContacts: `${backEndUrl}${baseRouteName}`,
  searchContacts: `${backEndUrl}${baseRouteName}/search`,
  getContactsByUserId: `${backEndUrl}${baseRouteName}/user`,
};
