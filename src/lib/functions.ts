import { http } from "./axios-instance";
import { CryptoService } from "./crypto-service";
import { getData, saveData } from "./index-db";

export function splitMsg(text: any) {
  const parts =
    text
      ?.split(/',\s*'/)
      ?.map((p: string) => p.replace(/^'+|'+$/g, "").trim()) || [];

  return {
    status: parts[0] || "",
    title: parts[1] || "",
    desc: parts[2] || "",
  };
}

export async function fetchData({
  cachedKey,
  url,
  payload,
  setFn,
  showToast,
  expireIn = 60 * 5, // default 5 minutes (in seconds)
}: {
  cachedKey?: string | null | undefined;
  url: string;
  payload: any;
  setFn?: (value: any) => void;
  showToast?: (status: string, title: string, desc: string) => void;
  expireIn?: number; // cache expiry in seconds
}) {
  if (cachedKey) {
    const cached = await getData(cachedKey);

    if (cached) {
      const now = Date.now();
      const diff = (now - cached.timestamp) / 1000; // seconds

      if (diff < expireIn) {
        // Cache Fresh
        setFn && setFn(cached.data);
        console.log("Data loaded from IndexedDB cache (fresh)");
        return;
      } else {
        console.log("Cache expired — fetching fresh API data...");
      }
    }
  }

  // API CALL
  try {
    const response: any = await http.post(url, payload);
    const apiData = response.data.data;
    setFn && setFn(apiData);

    // SHOW TOAST
    if (showToast) {
      if (typeof response.meta.message === "string") {
        const msg = splitMsg(response.meta.message);
        showToast(msg.status, msg.title, msg.desc);
      } else {
        showToast("success", "Successfully", response?.meta?.message);
      }
    }

    // Save to cache
    if (cachedKey) {
      await saveData(cachedKey, apiData);
      console.log("Data saved to cache with timestamp");
    }
  } catch (error: any) {
    console.error("API fetch error:", error);

    if (showToast) {
      if (typeof error?.meta?.message === "string") {
        const msg = splitMsg(error.meta.message);
        showToast(msg.status, msg.title, msg.desc);
      } else {
        showToast("error", "Failed", error?.meta?.message);
      }
    }
  }
}


export async function loginRequest({
  url,
  username,
  password,
  setState,
}: {
  url: string;
  username: string;
  password: string;
  setState?: (value: any) => void; // same as setFn
}) {
  try {
    username = username.trim().toLowerCase();
    const reqBody = {
      userName: username,
      password: password,
      ts: Date.now(),
    };
    const encrypted = await CryptoService.encryptJSON1(reqBody);

    const requestBody = {
      data: encrypted.iv + "###" + encrypted.payload,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const encryptedResponse = await response.text();

    const result: any = await CryptoService.decryptApiResponse(
      encryptedResponse
    );
    if (result?.meta?.status_code === 200) {
      // Save tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("intCasino", result.data.intCasino);
        localStorage.setItem(
          "userDetail",
          JSON.stringify(result.data.userDetail)
        );
        localStorage.setItem("newLogin", "true");
      }

      // update zustand state (optional)
      setState &&
        setState({
          isLoggedIn: true,
          token: result.data.accessToken,
          userDetail: result.data.userDetail,
          error: null,
          showModal: false,
        });

      return {
        success: true,
        meta: result.meta,
        data: result.data,
      };
    }

    // ---------------------------------------------------
    // 7) FAILURE
    // ---------------------------------------------------
    const errMsg = result?.meta?.message || "Login failed";

    setState &&
      setState({
        isLoggedIn: false,
        token: null,
        userDetail: null,
        error: errMsg,
      });

    return {
      success: false,
      meta: result.meta,
      data: null,
    };
  } catch (err: any) {
    console.log("🔴 Login Error:", err);

    let errorMsg = "Something went wrong";

    // Try decrypting backend error
    try {
      const decryptedErr = await CryptoService.decryptApiResponse(
        err?.response?.data
      );

      errorMsg =
        decryptedErr?.meta?.message ||
        decryptedErr?.message ||
        decryptedErr?.error ||
        errorMsg;
    } catch {}

    setState &&
      setState({
        isLoggedIn: false,
        token: null,
        userDetail: null,
        meta: errorMsg,
      });

    return {
      success: false,
      meta: { message: errorMsg, status_code: 500 },
    };
  }
}
