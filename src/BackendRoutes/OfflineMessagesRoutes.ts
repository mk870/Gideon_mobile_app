import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/offline-messages";

export const offlineMessagesRoutes = {
  createGetByIdDeleteAndGetAllOfflineMessages: `${backEndUrl}${baseRouteName}`,
  getOfflineMessagesByUserId: `${backEndUrl}${baseRouteName}/user`,
};
