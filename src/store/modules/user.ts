import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import { removeToken, setToken } from "@/utils/cookies";
import { resetRouter } from "@/router";
import { LayoutModule } from "./layout";

export interface UserState {
  token: string;
  userId: string;
  userName: string;
  roles: string[];
}

@Module({ dynamic: true, store, name: "user", namespaced: true })
class User extends VuexModule implements UserState {
  public token: string = "";
  public userId: string = "";
  public userName: string = "";
  public roles: string[] = [];

  @Action
  public login() {
    let token = "1";
    setToken(token);
    this.SET_TOKEN(token);
  }

  @Action
  public async LogOut() {
    if (this.token === "") {
      throw Error("LogOut: token is undefined!");
    }
    // await logout()
    removeToken();
    resetRouter();

    // 删除 Tags
    LayoutModule.deleteAllTags();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async getUserInfo() {
    let roles: string[] = ["admin"];
    this.SET_ROLES(roles);
    this.SET_USER_ID("k100338");
    this.SET_NAME("Kbt");
    return roles;
  }

  @Action
  public ResetToken() {
    removeToken();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public changeRoles(roles: string[]) {
    this.SET_ROLES(roles);
  }

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  public SET_USER_ID(userId: string) {
    this.userId = userId;
  }

  @Mutation
  private SET_NAME(userName: string) {
    this.userName = userName;
  }

  @Mutation
  public SET_ROLES(roles: string[]) {
    this.roles = roles;
  }
}

export const UserModule = getModule(User);
