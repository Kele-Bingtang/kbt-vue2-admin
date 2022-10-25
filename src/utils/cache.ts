import { Tag } from "@/store/modules/layout";
import { SettingsState } from "@/store/modules/settings";

// 语言缓存
const languageKey = "kbt_language";
export const getCacheLanguage = () => localStorage.getItem(languageKey);
export const setCacheLanguage = (language: string) => localStorage.setItem(languageKey, language);

// Element UI 的 size 缓存
const sizeKey = "kbt_size";
export const getCacheSize = () => localStorage.getItem(sizeKey);
export const setCacheSize = (size: string) => localStorage.setItem(sizeKey, size);

// 用户 token 缓存
const tokenKey = "kbt_token";
export const getCacheToken = () => localStorage.getItem(tokenKey);
export const setCacheToken = (token: string) => localStorage.setItem(tokenKey, token);
export const removeCacheToken = () => localStorage.removeItem(tokenKey);

// 侧边菜单栏折叠缓存
const sideMenuStatusKey = "kbt_side_menu_status";
export const getCacheSideMenuStatus = () => localStorage.getItem(sideMenuStatusKey);
export const setCacheSideMenuStatus = (sideMenuStatus: string) =>
  localStorage.setItem(sideMenuStatusKey, sideMenuStatus);

// 标签页的 tags 缓存
const tagNavListKey = "kbt_tags_nav";
export const getCacheTagNavList = () => JSON.parse(localStorage.getItem(tagNavListKey) || "[]");
export const setCacheTagNavList = (tagNavList: Array<Tag>) =>
  localStorage.setItem(tagNavListKey, JSON.stringify(tagNavList));
export const removeCacheTagNavList = () => localStorage.removeItem(tagNavListKey);

interface CacheSettings {
  cacheTheme: string; // 缓存的 Element UI 主题色
  cacheSideMenuTheme: string; // 缓存的侧边菜单栏主题色
  cacheShowTagsNav: boolean; // 缓存的是否显示标签页
  cacheRecordTagsNav: boolean; // 缓存的打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  cacheShowLayoutLogo: boolean; // 缓存的是否显示侧边菜单栏的 Logo
  cacheShowBreadcrumb: boolean; // 缓存的是否使用面包屑
  cacheTitleMode: string; // 缓存的标题在浏览器标签上的多种模式。0：title + 页面 title，1：用户名 + 页面 title，2：title，3：页面 title
  cacheLayoutMode: string; // 缓存的布局设置，0：SideMenu 占屏幕左侧，Header 和 Main Content 占右侧，1：Header 占顶部一行，SideMenu 占下方左侧，Main Content 占下方右侧
}

// 全局 settings 缓存
export const getCacheSettings = (): CacheSettings => {
  return JSON.parse(localStorage.getItem("kbt_settings") || "{}");
};
export const setCacheSettings = (value: SettingsState) => {
  let { theme, sideMenuTheme, showTagsNav, recordTagsNav, showLayoutLogo, titleMode, showBreadcrumb, layoutMode } =
    value;
  localStorage.setItem(
    "kbt_settings",
    `{
        "cacheTheme": "${theme}",
        "cacheSideMenuTheme": "${sideMenuTheme}",
        "cacheShowTagsNav": ${showTagsNav},
        "cacheRecordTagsNav": ${recordTagsNav},
        "cacheShowLayoutLogo": ${showLayoutLogo},
        "cacheShowBreadcrumb": ${showBreadcrumb},
        "cacheTitleMode": "${titleMode}",
        "cacheLayoutMode": "${layoutMode}"
      }`
  );
};
export const removeCacheSettings = () => {
  localStorage.removeItem("kbt_settings");
};
