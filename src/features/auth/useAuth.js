import { useDispatch, useSelector } from "react-redux";
import { 
  login, 
  register, 
  logout, 
  checkAuth, 
  refreshToken, 
  updateUser 
} from "./authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const loginUser = (credentials) => dispatch(login(credentials));
  const registerUser = (userData) => dispatch(register(userData));
  const logoutUser = () => dispatch(logout());
  const checkAuthStatus = () => dispatch(checkAuth());
  const refreshAuthToken = () => dispatch(refreshToken());
  const updateUserProfile = (userId, updateData) => dispatch(updateUser({ userId, updateData }));

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    loginUser,
    registerUser,
    logoutUser,
    checkAuthStatus,
    refreshAuthToken,
    updateUserProfile,
  };
}