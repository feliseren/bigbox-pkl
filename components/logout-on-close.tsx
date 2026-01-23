"use client";

import { useEffect } from "react";

export function LogoutOnClose() {
  useEffect(() => {
    const logoutUrl = "/api/logout";

    const sendLogout = () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(logoutUrl);
        return;
      }
      void fetch(logoutUrl, { method: "POST", keepalive: true });
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted) return;
      const rememberCookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith("bb_remember="));
      if (rememberCookie?.split("=")[1] === "1") return;
      sendLogout();
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
