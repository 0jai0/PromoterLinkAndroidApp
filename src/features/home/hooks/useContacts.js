import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchContactsAction } from "./contacts.actions";

const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useContacts = (userId) => {
  const dispatch = useDispatch();
  const { items, loading, error, lastFetched, userId: cachedUserId } = useSelector(
    (state) => state.contacts
  );

  const shouldRefetch =
    !lastFetched ||
    (userId && userId !== cachedUserId) ||
    Date.now() - lastFetched > CACHE_TIMEOUT;

  useEffect(() => {
    if (userId && shouldRefetch) {
      dispatch(fetchContactsAction(userId));
    }
  }, [userId, shouldRefetch, dispatch]);

  const refetch = () => {
    if (userId) {
      dispatch(fetchContactsAction(userId));
    }
  };

  return { contacts: items, loading, error, refetch };
};
