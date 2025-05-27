import { useEffect } from "react";
import { checkAuthStatus } from "../features/auth.slice";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../hooks/redux";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status when component mounts or URL changes
    const checkAuth = async () => {
      if (!user) {
        await dispatch(checkAuthStatus());
      }
    };

    checkAuth();

    // Also check when returning from OAuth callback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_callback") {
        console.log("auth callback");
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, user]);

  return <>{children}</>;
};
