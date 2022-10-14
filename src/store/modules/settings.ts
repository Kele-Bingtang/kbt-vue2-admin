import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import defaultSettings from "@/config/settings";
import {
  getCacheSettings,
  removeCacheSettings,
  setCacheSettings,
} from "@/utils/cache";

const { showSettings, showTagsNav, showSideMenuLogo, theme, sideMenuTheme } =
  defaultSettings;

const {
  cacheTheme,
  cacheSideMenuTheme,
  cacheShowTagsNav,
  cacheShowSideMenuLogo,
} = getCacheSettings();

export interface SettingsState {
  theme: string;
  sideMenuTheme: string;
  showSettings: boolean;
  showTagsNav: boolean;
  showSideMenuLogo: boolean;
}

interface PayLoad {
  key: string;
  value: any;
}

@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  public theme = cacheTheme || theme;
  public sideMenuTheme =
    cacheSideMenuTheme === undefined ? sideMenuTheme : cacheSideMenuTheme;
  public showSettings = showSettings;
  public showTagsNav =
    cacheShowTagsNav === undefined ? showTagsNav : cacheShowTagsNav;
  public showSideMenuLogo =
    cacheShowSideMenuLogo === undefined
      ? showSideMenuLogo
      : cacheShowSideMenuLogo;

  @Action
  public changeSetting(payload: PayLoad) {
    this.CHANGE_SETTING(payload);
  }

  @Action
  public resetSettings() {
    removeCacheSettings();
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
      showSideMenuLogo: this.showSideMenuLogo,
      showSettings: this.showSettings,
    };
    setCacheSettings(settings);
  }
}

export const SettingsModule = getModule(Settings);
