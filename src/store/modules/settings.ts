import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import defaultSettings from "@/config/settings";
import { getCacheSettings, removeCacheSettings, removeCacheTagNavList, setCacheSettings } from "@/utils/cache";

const { showSettings, showTagsNav, recordTagsNav, showSideMenuLogo, theme, sideMenuTheme, showBreadcrumb, titleMode } =
  defaultSettings;

const {
  cacheTheme,
  cacheSideMenuTheme,
  cacheShowTagsNav,
  cacheRecordTagsNav,
  cacheShowSideMenuLogo,
  cacheShowBreadcrumb,
  cacheTitleMode,
} = getCacheSettings();

export interface SettingsState {
  theme: string; // Element UI 主题色
  titleMode: string; // 标题在浏览器标签上的多种模式。0：title + 页面 title，1：用户名 + 页面 title，2：title，3：页面 title
  sideMenuTheme: string; // 侧边菜单栏主题色
  showSettings: boolean; // 是否显示 settings 配置
  showTagsNav: boolean; // 是否显示标签页
  recordTagsNav: boolean; // 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  showSideMenuLogo: boolean; // 是否显示侧边菜单栏的 Logo
  showBreadcrumb: boolean; // 是否使用面包屑
}

interface PayLoad {
  key: string;
  value: any;
}

@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  public theme = cacheTheme || theme;
  public titleMode = cacheTitleMode || titleMode;
  public sideMenuTheme = cacheSideMenuTheme || sideMenuTheme;
  public showSettings = showSettings;
  public showTagsNav = cacheShowTagsNav === undefined ? showTagsNav : cacheShowTagsNav;
  public recordTagsNav = cacheRecordTagsNav === undefined ? recordTagsNav : cacheRecordTagsNav;
  public showSideMenuLogo = cacheShowSideMenuLogo === undefined ? showSideMenuLogo : cacheShowSideMenuLogo;
  public showBreadcrumb = cacheShowBreadcrumb === undefined ? showBreadcrumb : cacheShowBreadcrumb;

  @Action
  public changeSetting(payload: PayLoad) {
    this.CHANGE_SETTING(payload);
  }

  @Action
  public resetSettings() {
    removeCacheSettings();
    if (!this.recordTagsNav) {
      removeCacheTagNavList();
    }
  }

  @Mutation
  private CHANGE_SETTING(payload: PayLoad) {
    const { key, value } = payload;
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value;
    }
    let settings: SettingsState = {
      theme: this.theme,
      sideMenuTheme: this.sideMenuTheme,
      showTagsNav: this.showTagsNav,
      recordTagsNav: this.recordTagsNav,
      showSideMenuLogo: this.showSideMenuLogo,
      showSettings: this.showSettings,
      titleMode: this.titleMode,
      showBreadcrumb: this.showBreadcrumb,
    };
    setCacheSettings(settings);
    if (key === "recordTagsNav" && !value) {
      removeCacheTagNavList();
    }
  }
}

export const SettingsModule = getModule(Settings);
