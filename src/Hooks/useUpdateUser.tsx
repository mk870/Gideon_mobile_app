/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { IUser } from '../GlobalTypes/UserTypes';
import { useAppDispatch } from '../Redux/Hooks/Config';
import { addAccessToken, addFamilyName, addGivenName, addUserId } from '../Redux/Slices/UserSlice';


const useUpdateUser = (user: IUser | null) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user) {
      dispatch(addFamilyName(user.familyName));
      dispatch(addGivenName(user.givenName));
      dispatch(addUserId(user.id));
      dispatch(addAccessToken(user.accessToken))
    }
  }, [user]);
}

export default useUpdateUser