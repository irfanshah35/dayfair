import { create } from "zustand";
import { loginRequest, splitMsg } from "../functions";
import { CONFIG } from "../config";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userDetail: any | null;
  error: string | null;
  showModal: boolean;

  // ACTIONS
  loginUser: (
    username: string,
    password: string,
    showToast?: any
  ) => Promise<any>;
  logoutUser: () => void;
  setError: (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  token: null,
  userDetail: null,
  error: null,
  showModal: false,

  // ---------------------------------------------
  // LOGIN ACTION
  // ---------------------------------------------
  loginUser: async (
    username: string,
    password: string,
    showToast?: (status: string, title: string, desc: string) => void
  ) => {
    set({ error: null });

    const result: any = await loginRequest({
      url: CONFIG.userLogin,
      username,
      password,
      setState: set,
    });

    // ---- Toast
    if (showToast) {
      if (typeof result?.meta?.message === "string") {
        const msg = splitMsg(result.meta.message);
        showToast(msg.status, msg.title, msg.desc);
      } else {
        showToast(
          result?.success ? "success" : "error",
          result?.success ? "Successfully" : "Failed",
          result?.meta?.message || "Unknown error"
        );
      }
    }

    return result;
  },

  // ---------------------------------------------
  // LOGOUT ACTION
  // ---------------------------------------------
  logoutUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("intCasino");
      localStorage.removeItem("userDetail");
      localStorage.removeItem("newLogin");
    }

    set({
      isLoggedIn: false,
      token: null,
      userDetail: null,
      error: null,
    });
  },

  // ---------------------------------------------
  // ERROR SETTER (optional)
  // ---------------------------------------------
  setError: (msg: any) => set({ error: msg }),
}));
