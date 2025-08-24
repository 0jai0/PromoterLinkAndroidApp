import API from "../../api/config";

export const fetchContacts = async (userId) => {
  const response = await API.get(`/api/collection/users/${userId}`);
  return response.data;
};

export const addToContacts = async (userId, targetUserId) => {
  const response = await API.post("/api/collection/users/add", {
    userId,
    targetUserId
  });
  return response.data;
};