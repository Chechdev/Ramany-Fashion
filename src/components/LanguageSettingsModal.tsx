"use client";

import React, { useState } from "react";
import { Globe, Check, X, Sparkles, Settings } from "lucide-react";
import { useLanguage, LANGUAGES, Language } from "@/lib/i18n";

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSettingsModal({ isOpen, onClose }: LanguageSettingsModalProps) {
  const { lang, setLang, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(lang);

  if (!isOpen) return null;

  const handleApply = (newLang: Language) => {
    setSelectedLang(newLang);
    setLang(newLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">{t("settingsTitle")}</h3>
              <p className="text-xs text-neutral-400">{t("chooseLanguage")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-500 leading-relaxed">
            {t("languageDesc")}
          </p>

          <div className="space-y-2.5">
            {LANGUAGES.map((item) => {
              const isSelected = selectedLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleApply(item.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-neutral-950 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-950/20"
                      : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/60 hover:bg-white text-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-wide">{item.nativeName}</span>
                        {item.code === "en" && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isSelected ? "bg-amber-400 text-neutral-950" : "bg-neutral-200 text-neutral-700"
                            }`}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                        {item.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-neutral-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>RAMANY International</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition cursor-pointer"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Nút chuyển ngôn ngữ / Cài đặt xuất hiện trên Header & Topbar
 */
export function LanguageButton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentOption = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
            variant === "dark"
              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200"
          }`}
          title="Change language / Đổi ngôn ngữ"
        >
          <span className="text-sm">{currentOption.flag}</span>
          <span className="font-mono text-[11px] uppercase">{currentOption.code}</span>
          <Globe className="w-3 h-3 opacity-60 ml-0.5" />
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white border border-neutral-200 py-1.5 z-50 animate-scale font-sans">
              <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Select Language</span>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setIsOpen(true);
                  }}
                  className="hover:text-neutral-900 text-neutral-500 cursor-pointer"
                  title="More Settings"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>

              {LANGUAGES.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setLang(opt.code);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                    lang === opt.code
                      ? "bg-neutral-900 text-white font-bold"
                      : "text-neutral-700 hover:bg-neutral-100 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <span>{opt.nativeName}</span>
                  </span>
                  {lang === opt.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <LanguageSettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
