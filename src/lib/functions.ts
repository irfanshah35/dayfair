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
  expireIn = 60 * 5, // default 5 minutes (in seconds),
  forceApiCall,
}: {
  cachedKey?: string | null | undefined;
  url: string;
  payload: any;
  setFn?: (value: any) => void;
  showToast?: (
    status: "error" | "info" | "success" | "warning",
    title: string,
    desc: string
  ) => void;
  expireIn?: number; // cache expiry in seconds
  forceApiCall?: boolean;
}) {
  if (cachedKey) {
    const cached = await getData(cachedKey);

    if (!forceApiCall&&cached) {
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
const apiData = response?.data?.data ?? response?.data;
    setFn && setFn(apiData);

    // SHOW TOAST

    if (showToast) {
      if (
        typeof response?.meta?.message === "string" ||
        typeof response?.data?.meta?.message === "string"
      ) {
        const msg = splitMsg(
          response?.meta?.message || response?.data?.meta?.message
        );
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

// export function formatDateStamp(isoString: string) {
//   if (!isoString) return "";

//   const date = new Date(isoString);

//   const formatted = date.toLocaleString("en-GB", {
//     day: "numeric",
//     month: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   return formatted.replace(",", ""); // remove comma
// }
export function formatDateStamp(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);
  
  // Add 5 hours for Pakistan timezone (UTC+5)
  const pkDate = new Date(date.getTime() + (5 * 60 * 60 * 1000));

  const day = pkDate.getUTCDate();
  const month = pkDate.getUTCMonth() + 1;
  const year = pkDate.getUTCFullYear();

  let hours = pkDate.getUTCHours();
  const minutes = pkDate.getUTCMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

  return `${day}/${month}/${year} ${time}`;
}

export function formatDateDetail(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);
  
  // Add 5 hours for Pakistan timezone (UTC+5)
  const pkDate = new Date(date.getTime() + (5 * 60 * 60 * 1000));

  const day = pkDate.getUTCDate().toString().padStart(2, "0");
  const month = (pkDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = pkDate.getUTCFullYear();

  let hours = pkDate.getUTCHours();
  const minutes = pkDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = pkDate.getUTCSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  return `${day}-${month}-${year} ${time}`;
}

