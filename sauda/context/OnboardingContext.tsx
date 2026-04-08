"use client";

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";

export type VendorStatus = "registered" | "verified" | "active" | "suspended" | "terminated";

export interface OnboardingData {
  phone: string;
  smsVerified: boolean;
  profile: {
    name: string;
    stallNumber: string;
    stallPhoto: string | null;
    bazaar: string;
    city: string;
  };
  products: {
    categories: string[];
    prices: Record<string, number>;
  };
  payment: {
    method: "kaspi" | "bank";
    kaspiPhone: string;
    bankIBAN: string;
  };
  agreement: {
    termsAccepted: boolean;
    dataConsentAccepted: boolean;
    digitalSignature: string;
    acceptedAt: string | null;
  };
  tutorialCompleted: boolean;
}

export interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  isComplete: boolean;
  vendorStatus: VendorStatus;
  isSeedMode: boolean;          // true = showing existing "Аслан" demo vendor
  iin: string | null;
  iinVerified: boolean;
  loanConsentGiven: boolean;
  data: OnboardingData;
}

type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GOTO_STEP"; step: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "UPDATE_DATA"; partial: Partial<OnboardingData> }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "SET_VENDOR_STATUS"; status: VendorStatus }
  | { type: "SET_IIN"; iin: string }
  | { type: "SET_LOAN_CONSENT"; accepted: boolean }
  | { type: "SKIP_TO_DEMO" };   // loads existing "Аслан" demo

const defaultData: OnboardingData = {
  phone: "",
  smsVerified: false,
  profile: { name: "", stallNumber: "", stallPhoto: null, bazaar: "", city: "Алматы" },
  products: { categories: [], prices: {} },
  payment: { method: "kaspi", kaspiPhone: "", bankIBAN: "" },
  agreement: { termsAccepted: false, dataConsentAccepted: false, digitalSignature: "", acceptedAt: null },
  tutorialCompleted: false,
};

function getInitialState(): OnboardingState {
  if (typeof window === "undefined") {
    return {
      currentStep: 1,
      isComplete: false,
      vendorStatus: "registered",
      isSeedMode: false,
      iin: null,
      iinVerified: false,
      loanConsentGiven: false,
      data: defaultData,
    };
  }
  const stored = localStorage.getItem("sauda_onboarding_complete");
  const statusStored = (localStorage.getItem("sauda_vendor_status") as VendorStatus) || null;
  const isSeedMode = localStorage.getItem("sauda_seed_mode") === "true";

  return {
    currentStep: 1,
    isComplete: stored === "true",
    vendorStatus: isSeedMode ? "active" : (statusStored || "registered"),
    isSeedMode,
    iin: localStorage.getItem("sauda_iin") || null,
    iinVerified: false,
    loanConsentGiven: false,
    data: defaultData,
  };
}

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "NEXT_STEP": {
      const next = Math.min(6, state.currentStep + 1) as OnboardingState["currentStep"];
      return { ...state, currentStep: next };
    }
    case "PREV_STEP": {
      const prev = Math.max(1, state.currentStep - 1) as OnboardingState["currentStep"];
      return { ...state, currentStep: prev };
    }
    case "GOTO_STEP":
      return { ...state, currentStep: action.step };
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.partial } };
    case "COMPLETE_ONBOARDING":
      if (typeof window !== "undefined") {
        localStorage.setItem("sauda_onboarding_complete", "true");
        localStorage.setItem("sauda_vendor_status", "registered");
      }
      return { ...state, isComplete: true, vendorStatus: "registered" };
    case "SET_VENDOR_STATUS":
      if (typeof window !== "undefined") {
        localStorage.setItem("sauda_vendor_status", action.status);
      }
      return { ...state, vendorStatus: action.status };
    case "SET_IIN":
      if (typeof window !== "undefined") localStorage.setItem("sauda_iin", action.iin);
      return { ...state, iin: action.iin };
    case "SET_LOAN_CONSENT":
      return { ...state, loanConsentGiven: action.accepted };
    case "SKIP_TO_DEMO":
      if (typeof window !== "undefined") {
        localStorage.setItem("sauda_onboarding_complete", "true");
        localStorage.setItem("sauda_vendor_status", "active");
        localStorage.setItem("sauda_seed_mode", "true");
      }
      return { ...state, isComplete: true, vendorStatus: "active", isSeedMode: true };
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  nextStep: () => void;
  prevStep: () => void;
  gotoStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  setVendorStatus: (status: VendorStatus) => void;
  saveIIN: (iin: string) => void;
  setLoanConsent: (accepted: boolean) => void;
  skipToDemo: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const nextStep = useCallback(() => dispatch({ type: "NEXT_STEP" }), []);
  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const gotoStep = useCallback((step: 1|2|3|4|5|6) => dispatch({ type: "GOTO_STEP", step }), []);
  const updateData = useCallback((partial: Partial<OnboardingData>) => dispatch({ type: "UPDATE_DATA", partial }), []);
  const completeOnboarding = useCallback(() => dispatch({ type: "COMPLETE_ONBOARDING" }), []);
  const setVendorStatus = useCallback((status: VendorStatus) => dispatch({ type: "SET_VENDOR_STATUS", status }), []);
  const saveIIN = useCallback((iin: string) => dispatch({ type: "SET_IIN", iin }), []);
  const setLoanConsent = useCallback((accepted: boolean) => dispatch({ type: "SET_LOAN_CONSENT", accepted }), []);
  const skipToDemo = useCallback(() => dispatch({ type: "SKIP_TO_DEMO" }), []);

  return (
    <OnboardingContext.Provider value={{ state, nextStep, prevStep, gotoStep, updateData, completeOnboarding, setVendorStatus, saveIIN, setLoanConsent, skipToDemo }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
