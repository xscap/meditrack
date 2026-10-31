import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase.jsx";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const LAST_ACTIVITY_KEY = "meditrack_last_activity";

const AuthSessionTimeout = () => {
  const navigate = useNavigate();
  const sessionRef = useRef(null);

  useEffect(() => {
    let timerId;
    let hasExpired = false;
    let lastActivity = null;
    let lastPersistedActivity = null;

    const clearTimer = () => {
      window.clearTimeout(timerId);
      timerId = undefined;
    };

    const expireSession = async () => {
      if (hasExpired) return;
      hasExpired = true;
      clearTimer();

      let authMessage =
        "You were signed out after 15 minutes of inactivity.";

      try {
        const { error } = await supabase.auth.signOut({ scope: "local" });
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Unable to sign out after inactivity:", error);
        authMessage =
          "Your session expired due to inactivity. Please sign in again.";
      } finally {
        sessionRef.current = null;
        window.sessionStorage.removeItem(LAST_ACTIVITY_KEY);
        navigate("/login", {
          replace: true,
          state: { authMessage },
        });
      }
    };

    const checkIdleTimeout = () => {
      if (!sessionRef.current || hasExpired || lastActivity === null) return;

      const remaining = IDLE_TIMEOUT_MS - (Date.now() - lastActivity);
      if (remaining <= 0) {
        void expireSession();
        return;
      }

      clearTimer();
      timerId = window.setTimeout(checkIdleTimeout, remaining);
    };

    const handleActivity = () => {
      if (!sessionRef.current || hasExpired) return;

      const now = Date.now();
      if (
        lastActivity !== null &&
        now - lastActivity >= IDLE_TIMEOUT_MS
      ) {
        void expireSession();
        return;
      }

      lastActivity = now;
      if (now - (lastPersistedActivity ?? 0) >= 1000) {
        window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
        lastPersistedActivity = now;
      }
      checkIdleTimeout();
    };

    const handleStorageActivity = (event) => {
      if (
        event.key !== LAST_ACTIVITY_KEY ||
        !sessionRef.current ||
        !event.newValue
      ) {
        return;
      }

      const activity = Number(event.newValue);
      if (Number.isFinite(activity) && activity > (lastActivity ?? 0)) {
        lastActivity = activity;
        lastPersistedActivity = activity;
        checkIdleTimeout();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkIdleTimeout();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        sessionRef.current = session;
        if (!session) {
          hasExpired = false;
          lastActivity = null;
          clearTimer();
          window.localStorage.removeItem(LAST_ACTIVITY_KEY);

          if (event === "SIGNED_OUT") {
            navigate("/login", { replace: true });
          }
          return;
        }

        hasExpired = false;
        if (event === "SIGNED_IN") {
          lastActivity = Date.now();
          lastPersistedActivity = lastActivity;
          window.localStorage.setItem(
            LAST_ACTIVITY_KEY,
            String(lastActivity)
          );
        } else if (event === "INITIAL_SESSION") {
          const storedActivity = Number(
            window.localStorage.getItem(LAST_ACTIVITY_KEY)
          );
          lastActivity =
            Number.isFinite(storedActivity) && storedActivity > 0
              ? storedActivity
              : Date.now();
          lastPersistedActivity = lastActivity;
          window.localStorage.setItem(
            LAST_ACTIVITY_KEY,
            String(lastActivity)
          );
        } else if (lastActivity === null) {
          lastActivity = Date.now();
        }

        checkIdleTimeout();
      }
    );

    const activityEvents = [
      "pointerdown",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, handleActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageActivity);

    return () => {
      clearTimer();
      subscription.unsubscribe();
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, handleActivity)
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageActivity);
    };
  }, [navigate]);

  return null;
};

export default AuthSessionTimeout;
