import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/chats";

export const chatsRoutes = {
  createGetByIdDeleteAndGetAllChats: `${backEndUrl}${baseRouteName}`,
  getLatestChats: `${backEndUrl}${baseRouteName}/latest`,
  searchChats: `${backEndUrl}${baseRouteName}/search`,
};
