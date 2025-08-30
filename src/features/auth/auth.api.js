import API from "../../api/config";


// Register User
export const registerApi = async (data) => {
  const res = await API.post("/api/pageowners/register", data, {
    withCredentials: true
  });
  return res.data;
};

// Login User
export const loginApi = async (data) => {
  let res;
  
  if (data.isGoogleAuth) {
    // Handle Google login
    res = await API.post("/api/pageowners/google", 
      { credential: data.credential }, 
      { withCredentials: true }
    );
  } else {
    // Handle regular login
    res = await API.post("/api/pageowners/login", data, {
      withCredentials: true
    });
  }
  return res.data;
};

// Logout User
export const logoutApi = async () => {
  const res = await API.post("/api/pageowners/logout", {}, {
    withCredentials: true
  });
  return res.data;
};

// Check Authentication Status
export const checkAuthApi = async (token, userId) => {
  const res = await API.get("/api/pageowners/check-auth", {
    withCredentials: true,
    headers: { 
      Authorization: `Bearer ${token}`,
      userid: userId 
    }
  });
  return res.data;
};

// Refresh Token
export const refreshTokenApi = async (token) => {
  const res = await API.post("/api/pageowners/refresh", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  });
  return res.data;
};

// Update User
export const updateUserApi = async (userId, updateData) => {
  const res = await API.put(`/api/pageowners/updateUser/${userId}`, updateData, {
    withCredentials: true
  });
  return res.data;
};