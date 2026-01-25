import { backEndUrl } from "../Utils/Constants";

const baseRouteName = "/memories";

export const memoriesRoutes = {
  createGetByIdDeleteAndGetAllMemories: `${backEndUrl}${baseRouteName}`,
  searchMemories: `${backEndUrl}${baseRouteName}/search`,
};
