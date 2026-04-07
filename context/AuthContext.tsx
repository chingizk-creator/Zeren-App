"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

export interface UserAddress {
  street: string;
  apartment: string | null;
  entrance: string | null;
  comment: string | null;
}

export interface AuthUser {
  isAuthenticated: boolean;
  phone: string | null;           // "+77001234567"
  address: UserAddress | null;
  name: string | null;
  subscriptionPlan: string;
  memberSince: string | null;     // ISO date string
}

export type AuthStep = "phone" | "code" | "address" | null;

interface AuthState {
  user: AuthUser;
  authStep: AuthStep;        // which modal step is showing
  pendingPhone: string;      // phone being verified
  pendingCheckout: boolean;  // triggered from checkout button
  isVerifying: boolean;      // code verification loading
}

type AuthAction =
  | { type: "LOAD_USER"; user: AuthUser }
  | { type: "START_AUTH"; fromCheckout: boolean }
  | { type: "SET_STEP"; step: AuthStep }
  | { type: "SET_PENDING_PHONE"; phone: string }
  | { type: "SET_VERIFYING"; loading: boolean }
  | { type: "VERIFY_SUCCESS" }
  | { type: "SET_ADDRESS"; address: UserAddress }
  | { type: "CLOSE_AUTH" }
  | { type: "LOGOUT" }
  | { type: "SET_SUBSCRIPTION"; planId: string };

// ────────────────────────────────────────────────
// Storage helpers
// ────────────────────────────────────────────────

const STORAGE_KEY = "zeren_user";

function loadUser(): AuthUser {
  if (typeof window === "undefined") return defaultUser();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultUser(), ...JSON.parse(raw) };
  } catch {}
  return defaultUser();
}

function saveUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function defaultUser(): AuthUser {
  return {
    isAuthenticated: false,
    phone: null,
    address: null,
    name: null,
    subscriptionPlan: "plus",
    memberSince: null,
  };
}

// ────────────────────────────────────────────────
// Initial state
// ────────────────────────────────────────────────

const initialState: AuthState = {
  user: defaultUser(),
  authStep: null,
  pendingPhone: "",
  pendingCheckout: false,
  isVerifying: false,
};

// ────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOAD_USER":
      return { ...state, user: action.user };

    case "START_AUTH":
      return {
        ...state,
        authStep: "phone",
        pendingCheckout: action.fromCheckout,
        pendingPhone: "",
      };

    case "SET_STEP":
      return { ...state, authStep: action.step };

    case "SET_PENDING_PHONE":
      return { ...state, pendingPhone: action.phone };

    case "SET_VERIFYING":
      return { ...state, isVerifying: action.loading };

    case "VERIFY_SUCCESS": {
      const updatedUser: AuthUser = {
        ...state.user,
        isAuthenticated: true,
        phone: "+7" + state.pendingPhone,
        memberSince: state.user.memberSince ?? new Date().toISOString(),
      };
      return {
        ...state,
        user: updatedUser,
        isVerifying: false,
        // After code verified, go to address if none saved, else close
        authStep: updatedUser.address ? null : "address",
      };
    }

    case "SET_ADDRESS": {
      const updatedUser: AuthUser = {
        ...state.user,
        address: action.address,
      };
      return {
        ...state,
        user: updatedUser,
        authStep: null,
      };
    }

    case "CLOSE_AUTH":
      return {
        ...state,
        authStep: null,
        pendingPhone: "",
        pendingCheckout: false,
        isVerifying: false,
      };

    case "LOGOUT": {
      const guest = defaultUser();
      return { ...state, user: guest, authStep: null };
    }

    case "SET_SUBSCRIPTION": {
      const updatedUser = { ...state.user, subscriptionPlan: action.planId };
      return { ...state, user: updatedUser };
    }

    default:
      return state;
  }
}

// ────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────

interface AuthContextValue {
  authState: AuthState;
  startAuth: (fromCheckout?: boolean) => void;
  setAuthStep: (step: AuthStep) => void;
  setPendingPhone: (phone: string) => void;
  verifyCode: () => void;
  setAddress: (address: UserAddress) => void;
  closeAuth: () => void;
  logout: () => void;
  setUserSubscription: (planId: string) => void;
  /** True if auth just completed AND was triggered from checkout */
  shouldProceedToCheckout: boolean;
  /** Call this once you've consumed the checkout signal */
  consumeCheckoutSignal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Track whether we need to fire checkout after auth closes
  const checkoutSignalRef = React.useRef(false);

  // Load persisted user on mount
  useEffect(() => {
    const saved = loadUser();
    dispatch({ type: "LOAD_USER", user: saved });
  }, []);

  // Persist user whenever it changes
  useEffect(() => {
    if (state.user.phone !== null || state.user.address !== null) {
      saveUser(state.user);
    }
  }, [state.user]);

  const startAuth = useCallback((fromCheckout = false) => {
    dispatch({ type: "START_AUTH", fromCheckout });
  }, []);

  const setAuthStep = useCallback((step: AuthStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const setPendingPhone = useCallback((phone: string) => {
    dispatch({ type: "SET_PENDING_PHONE", phone });
  }, []);

  const verifyCode = useCallback(() => {
    dispatch({ type: "SET_VERIFYING", loading: true });
    // Simulate 0.5s network delay
    setTimeout(() => {
      dispatch({ type: "VERIFY_SUCCESS" });
    }, 500);
  }, []);

  const setAddress = useCallback((address: UserAddress) => {
    dispatch({ type: "SET_ADDRESS", address });
    // Signal checkout if this flow was triggered from checkout
    if (state.pendingCheckout) {
      checkoutSignalRef.current = true;
    }
  }, [state.pendingCheckout]);

  const closeAuth = useCallback(() => {
    dispatch({ type: "CLOSE_AUTH" });
    checkoutSignalRef.current = false;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setUserSubscription = useCallback((planId: string) => {
    dispatch({ type: "SET_SUBSCRIPTION", planId });
  }, []);

  // shouldProceedToCheckout: auth completed from checkout AND no more modal open
  const shouldProceedToCheckout =
    checkoutSignalRef.current && state.authStep === null && state.user.isAuthenticated;

  const consumeCheckoutSignal = useCallback(() => {
    checkoutSignalRef.current = false;
  }, []);

  // Also signal checkout when VERIFY_SUCCESS resolves with existing address
  useEffect(() => {
    if (
      state.user.isAuthenticated &&
      state.authStep === null &&
      state.pendingCheckout &&
      state.user.address !== null
    ) {
      checkoutSignalRef.current = true;
    }
  }, [state.user.isAuthenticated, state.authStep, state.pendingCheckout, state.user.address]);

  const value = useMemo<AuthContextValue>(
    () => ({
      authState: state,
      startAuth,
      setAuthStep,
      setPendingPhone,
      verifyCode,
      setAddress,
      closeAuth,
      logout,
      setUserSubscription,
      shouldProceedToCheckout,
      consumeCheckoutSignal,
    }),
    [
      state,
      startAuth,
      setAuthStep,
      setPendingPhone,
      verifyCode,
      setAddress,
      closeAuth,
      logout,
      setUserSubscription,
      shouldProceedToCheckout,
      consumeCheckoutSignal,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
