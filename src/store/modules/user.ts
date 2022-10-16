import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { removeCacheToken, setCacheToken } from "@/utils/cache";
import { resetRouter } from "@/router";
import { LayoutModule } from "./layout";

export interface UserInfo {
  userId: string; // 用户 ID
  userName: string; // 用户名
  roles?: string[]; // 用户角色
}

export interface UserState {
  token: string; // 用户的认证 token
  userInfo: UserInfo; // 用户信息
  roles: string[]; // 有时候 roles 需要等拿到 userId，再去获取，则不会在 userInfo 里
}

@Module({ dynamic: true, store, name: "user", namespaced: true })
class User extends VuexModule implements UserState {
  public token: string = "";
  public userInfo: UserInfo = {
    userId: "v1000",
    userName: "Visitor",
    roles: [],
  };
  public roles: string[] = [];

  @Action
  public login() {
    let token = "1";
    setCacheToken(token);
    this.SET_TOKEN(token);
  }

  @Action
  public async LogOut() {
    if (this.token === "") {
      throw Error("LogOut: token is undefined!");
    }
    // await logout()
    removeCacheToken();
    resetRouter();

    // 删除 Tags
    LayoutModule.deleteAllTags();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async getUserInfo() {
    let userInfo: UserInfo = {
      userId: "k100338",
      userName: "Kobe Liu",
      roles: ["admin"],
    };
    let roles: string[] = userInfo.roles || ["admin"];
    this.SET_ROLES(roles);
    this.SET_USER_INFO(userInfo);
    return roles;
  }

  @Action
  public ResetToken() {
    removeCacheToken();
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
  public SET_USER_INFO(userInfo: UserInfo) {
    this.userInfo = userInfo;
  }

  @Mutation
  public SET_ROLES(roles: string[]) {
    this.roles = roles;
  }
}

export const UserModule = getModule(User);
