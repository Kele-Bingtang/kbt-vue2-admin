import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import defaultSettings from "@/config/settings";

const { showSettings, showTagsNav, showSideMenuLogo } = defaultSettings;

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
  public theme = "#1890ff";
  public sideMenuTheme = "light";
  public showSettings = showSettings;
  public showTagsNav = showTagsNav;
  public showSideMenuLogo = showSideMenuLogo;

  @Action
  public changeSetting(payload: PayLoad) {
    this.CHANGE_SETTING(payload);
  }

  @Mutation
  private CHANGE_SETTING(payload: PayLoad) {
    const { key, value } = payload;
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value;
    }
  }
}

export const SettingsModule = getModule(Settings);
