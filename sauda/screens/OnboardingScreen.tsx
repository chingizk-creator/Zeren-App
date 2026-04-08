"use client";

import ProgressBar from "@/sauda/components/onboarding/ProgressBar";
import PhoneVerification from "@/sauda/components/onboarding/PhoneVerification";
import ProfileSetup from "@/sauda/components/onboarding/ProfileSetup";
import ProductCategories from "@/sauda/components/onboarding/ProductCategories";
import PaymentSetup from "@/sauda/components/onboarding/PaymentSetup";
import AgreementAcceptance from "@/sauda/components/onboarding/AgreementAcceptance";
import WelcomeTutorial from "@/sauda/components/onboarding/WelcomeTutorial";
import { useOnboarding } from "@/sauda/context/OnboardingContext";

export default function OnboardingScreen() {
  const { state, nextStep, prevStep, updateData, completeOnboarding, skipToDemo } = useOnboarding();
  const { currentStep, data } = state;

  // Called by WelcomeTutorial (step 6) when tutorial complete
  function handleComplete() {
    updateData({ tutorialCompleted: true });
    completeOnboarding();
  }

  const stepProps = {
    data,
    onUpdate: updateData,
    onNext: currentStep === 6 ? handleComplete : nextStep,
    onBack: currentStep > 1 ? prevStep : undefined,
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
      background: "#FAF7F0",
      maxWidth: 420,
      margin: "0 auto",
      overflow: "hidden",
    }}>
      {/* Progress bar — hidden on step 6 (welcome screen) */}
      {currentStep < 6 && (
        <div style={{ padding: "12px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#9A9490" }}>Шаг {currentStep} из 5</span>
            {/* Skip to demo link */}
            <button
              onClick={skipToDemo}
              style={{ fontSize: 12, color: "#9A9490", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Пропустить (демо)
            </button>
          </div>
          <ProgressBar currentStep={currentStep} />
        </div>
      )}

      {/* Screen content — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {currentStep === 1 && <PhoneVerification {...stepProps} />}
        {currentStep === 2 && <ProfileSetup {...stepProps} />}
        {currentStep === 3 && <ProductCategories {...stepProps} />}
        {currentStep === 4 && <PaymentSetup {...stepProps} />}
        {currentStep === 5 && <AgreementAcceptance {...stepProps} />}
        {currentStep === 6 && <WelcomeTutorial {...stepProps} />}
      </div>
    </div>
  );
}
