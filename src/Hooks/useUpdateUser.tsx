/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { IUser } from "../GlobalTypes/User";
import { useAppDispatch } from "../Redux/Hooks/Config";
import {
  addAccessToken,
  addContactNumber,
  addEmail,
  addFamilyName,
  addGivenName,
  addHeight,
  addLocation,
  addUserId,
  addWebSocketToken,
  addWeight,
} from "../Redux/Slices/UserSlice";

const useUpdateUser = (user: IUser | null) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user) {
      dispatch(addFamilyName(user.familyName));
      dispatch(addGivenName(user.givenName));
      dispatch(addUserId(user.id));
      dispatch(addEmail(user.email));
      dispatch(addWeight(user.weight));
      dispatch(addHeight(user.height));
      dispatch(addContactNumber(user.contactNumber));
      dispatch(addLocation(user.location));
      dispatch(addAccessToken(user.accessToken));
      dispatch(addWebSocketToken(user.webSocketToken));
    }
  }, [user]);
};

export default useUpdateUser;
