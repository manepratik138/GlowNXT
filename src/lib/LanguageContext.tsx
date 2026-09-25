"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "mr" | "hi";

interface Translations {
  [key: string]: {
    en: string;
    mr: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  nav_services: { en: "Services", mr: "सर्व्हिसेस", hi: "सेवाएं" },
  nav_pros: { en: "Professionals", mr: "ब्युटीशियन्स", hi: "एक्सपर्ट्स" },
  nav_analyzer: { en: "AI Skin Analyzer", mr: "AI स्किन अ‍ॅनालिझर", hi: "AI स्किन विश्लेषक" },
  nav_transformations: { en: "Transformations", mr: "रिझल्ट्स गॅलरी", hi: "परिणाम गैलरी" },
  nav_wedding: { en: "Wedding Special", mr: "लग्न स्पेशल", hi: "शादी स्पेशल" },
  nav_mehendi: { en: "Mehendi Art", mr: "मेहंदी आर्ट", hi: "मेहंदी आर्ट" },
  nav_become_pro: { en: "Become a Pro", mr: "ब्युटीशियन बना", hi: "पार्टनर बनें" },
  nav_dashboard: { en: "Dashboard", mr: "डॅशबोर्ड", hi: "डैशबोर्ड" },
  nav_login: { en: "Login / Signup", mr: "लॉगिन / साइनअप", hi: "लॉगिन / साइनअप" },

  // Hero
  hero_tag: { en: "India's #1 Salon at Home Marketplace", mr: "भारतातील #१ घरपोच ब्युटी व सलून सेवा", hi: "भारत की #1 घर पर सैलून सेवा" },
  hero_title_1: { en: "Premium Salon & Spa,", mr: "प्रीमियम सलून आणि स्पा,", hi: "प्रीमियम सैलून और स्पा," },
  hero_title_2: { en: "Right at Your Doorstep.", mr: "थेट तुमच्या घरात.", hi: "सीधे आपके घर पर." },
  hero_subtitle: {
    en: "Experience 5-star beauty treatments delivered by background-verified professionals with 100% single-use sealed hygienic kits.",
    mr: "तपासणी केलेले तज्ज्ञ ब्युटीशियन आणि १००% सीलबंद स्वच्छ किट्ससह घरबसल्या ५-स्टार ब्युटी ट्रीटमेंट्सचा आनंद घ्या.",
    hi: "वेरिफाइड एक्सपर्ट्स और 100% सील पैक हाइजीनिक किट के साथ अपने घर पर 5-स्टार ब्यूटी सर्विस पाएं."
  },
  hero_book_btn: { en: "Explore Services", mr: "सर्व्हिसेस पहा", hi: "सेवाएं देखें" },
  hero_ai_btn: { en: "Try AI Skin Scan", mr: "AI स्किन टेस्ट करा", hi: "AI स्किन स्कैन करें" },

  // Cart & Offers
  cart_title: { en: "Your Beauty Cart", mr: "तुमची ब्युटी कार्ट", hi: "आपकी ब्यूटी कार्ट" },
  cart_empty: { en: "Your cart is currently empty", mr: "तुमची कार्ट सध्या रिकामी आहे", hi: "आपकी कार्ट अभी खाली है" },
  cart_add_more: { en: "Add services to unlock bundle discounts", mr: "बंडल डिस्काउंटसाठी सर्व्हिसेस जोडा", hi: "बंडल छूट पाने के लिए सेवाएं जोड़ें" },
  cart_save_10: { en: "Add 1 more to unlock 10% Combo OFF!", mr: "आणखी १ जोडा आणि मिळवा १०% सूट!", hi: "1 और जोड़ें और पाएं 10% छूट!" },
  cart_save_20: { en: "Add 1 more to unlock 20% MEGA Combo OFF!", mr: "आणखी १ जोडा आणि मिळवा २०% मेगा सूट!", hi: "1 और जोड़ें और पाएं 20% बंपर छूट!" },
  cart_unlocked_20: { en: "🎉 20% Mega Combo Savings Applied!", mr: "🎉 २०% मेगा बंडल डिस्काउंट लागू झाला आहे!", hi: "🎉 20% मेगा कॉम्बो छूट लागू!" },
  cart_checkout_btn: { en: "Proceed to Book", mr: "बुकिंग पुढे सुरू करा", hi: "बुकिंग के लिए आगे बढ़ें" },

  // Guarantees
  guarantee_sealed: { en: "Single-Use Sealed Kits", mr: "१००% सीलबंद सिंगल-यूज किट्स", hi: "100% सील पैक किट्स" },
  guarantee_verified: { en: "Police-Verified Experts", mr: "व्हेरिफाईड ब्युटीशियन्स", hi: "वेरिफाइड प्रोफेशनल्स" },
  guarantee_otp: { en: "Safe Start/End OTP", mr: "सुरक्षित OTP व्हेरिफिकेशन", hi: "सुरक्षित OTP वेरिफिकेशन" },

  // AI Scanner
  analyzer_title: { en: "AI Skin & Hair Diagnostic", mr: "AI स्किन आणि हेअर अ‍ॅनालिसीस", hi: "AI स्किन और हेयर डायग्नोस्टिक" },
  analyzer_subtitle: {
    en: "Scan your face or take a 60-second quiz to get a dermatologist-grade routine and customized package.",
    mr: "तुमचा चेहरा स्कॅन करा किंवा ६०-सेकंद क्विझ द्या आणि तुमच्या त्वचेनुसार परफेक्ट पॅकेज मिळवा.",
    hi: "अपना चेहरा स्कैन करें या 60 सेकंड की क्विज देकर अपनी त्वचा अनुसार सही पैकेज पाएं."
  },
  analyzer_start_btn: { en: "Start Free Analysis", mr: "मोफत तपासणी सुरू करा", hi: "फ्री एनालिसिस शुरू करें" },

  // Wallet
  wallet_welcome: { en: "₹250 Welcome Credits Added!", mr: "₹२५० वेलकम बोनस जमा झाला आहे!", hi: "₹250 वेलकम बोनस मिला!" },
  wallet_refer: { en: "Refer & Earn ₹150", mr: "मित्राला सांगा आणि ₹१५० मिळवा", hi: "रेफर करें और ₹150 कमाएं" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "beautycafe_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && (saved === "en" || saved === "mr" || saved === "hi")) {
        setLanguageState(saved);
      }
    } catch (e) {
      console.error("Failed to load language", e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.error("Failed to save language", e);
    }
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
