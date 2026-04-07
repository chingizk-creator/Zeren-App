"use client";

import { useAuth } from "@/context/AuthContext";
import PhoneEntry from "./PhoneEntry";
import CodeVerification from "./CodeVerification";
import AddressEntry from "./AddressEntry";

/** Renders the active auth modal step, or nothing if authStep is null */
export default function AuthFlow() {
  const { authState } = useAuth();
  const { authStep } = authState;

  if (authStep === "phone") return <PhoneEntry />;
  if (authStep === "code") return <CodeVerification />;
  if (authStep === "address") return <AddressEntry />;
  return null;
}
