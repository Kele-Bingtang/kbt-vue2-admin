import Vue from "vue";
import Vuex from "vuex";
import { LayoutState } from "./modules/layout";
import { PermissionState } from "./modules/permission";
import { SettingsState } from "./modules/settings";
import { UserState } from "./modules/user";
import { MessageState } from "./modules/message";

Vue.use(Vuex);

export interface IStoreState {
  layout: LayoutState;
  permission: PermissionState;
  settings: SettingsState;
  user: UserState;
  message: MessageState;
}

export default new Vuex.Store<IStoreState>({});
