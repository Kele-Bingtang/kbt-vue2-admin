import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import elementVariables from "@/styles/element-variables.scss";
import defaultSettings from "@/config/settings";

export interface SettingsState {
  theme: string;
  showSettings: boolean;
  showTagsNav: boolean;
  showSideMenuLogo: boolean;
  sideMenuTextTheme: boolean;
}

@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  public theme = elementVariables.theme;
  public showSettings = defaultSettings.showSettings;
  public showTagsNav = defaultSettings.showTagsNav;
  public showSideMenuLogo = defaultSettings.showSideMenuLogo;
  public sideMenuTextTheme = defaultSettings.sideMenuTextTheme;

  @Action
  public changeSetting(payload: { key: string; value: any }) {
    this.CHANGE_SETTING(payload);
  }

  @Mutation
  private CHANGE_SETTING(payload: { key: string; value: any }) {
    const { key, value } = payload;
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value;
    }
  }
}

export const SettingsModule = getModule(Settings);
