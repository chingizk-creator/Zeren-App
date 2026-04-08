import type { OnboardingData } from "@/sauda/context/OnboardingContext";

// Demo new vendor going through registration
export const MOCK_NEW_VENDOR_ONBOARDING: Partial<OnboardingData> = {
  phone: "7051234567",
  smsVerified: false,
  profile: {
    name: "Бахыт",
    stallNumber: "Ряд 5, место 23",
    stallPhoto: null,
    bazaar: "Алтын Орда",
    city: "Алматы",
  },
  products: {
    categories: ["vegetables", "fruits"],
    prices: {
      "Помидоры": 480,
      "Огурцы": 350,
      "Перец болгарский": 700,
      "Яблоки": 400,
      "Виноград": 900,
    },
  },
  payment: {
    method: "kaspi",
    kaspiPhone: "7051234567",
    bankIBAN: "",
  },
};
