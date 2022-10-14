import { SettingsState } from "@/store/modules/settings";

const languageKey = "kbt_language";
export const getCacheLanguage = () => localStorage.getItem(languageKey);
export const setCacheLanguage = (language: string) =>
  localStorage.setItem(languageKey, language);

const sizeKey = "kbt_size";
export const getCacheSize = () => localStorage.getItem(sizeKey);
export const setCacheSize = (size: string) =>
  localStorage.setItem(sizeKey, size);

const tokenKey = "kbt_token";
export const getCacheToken = () => localStorage.getItem(tokenKey);
export const setCacheToken = (token: string) =>
  localStorage.setItem(tokenKey, token);
export const removeCacheToken = () => localStorage.removeItem(tokenKey);

interface cacheSettings {
  cacheTheme: string;
  cacheSideMenuTheme: string;
  cacheShowTagsNav: boolean;
  cacheShowSideMenuLogo: boolean;
}

export const getCacheSettings = (): cacheSettings => {
  return JSON.parse(localStorage.getItem("kbt_settings") || "{}");
};
export const setCacheSettings = (value: SettingsState) => {
  let { theme, sideMenuTheme, showTagsNav, showSideMenuLogo } = value;
  localStorage.setItem(
    "kbt_settings",
    `{
        "cacheTheme": "${theme}",
        "cacheSideMenuTheme": "${sideMenuTheme}",
        "cacheShowTagsNav": ${showTagsNav},
        "cacheShowSideMenuLogo": ${showSideMenuLogo}
      }`
  );
};
export const removeCacheSettings = () => {
  localStorage.removeItem("kbt_settings");
};
