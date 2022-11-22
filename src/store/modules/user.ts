import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { removeCacheToken, setCacheToken } from "@/utils/cache";
import { resetRouter } from "@/router";
import { LayoutModule } from "./layout";
import { loadRoutes } from "@/router/utils";
import { rolesRoutes } from "@/router/routes-config";
import router from "@/router";

export interface UserInfo {
  userId: string; // 用户 ID
  userName: string; // 用户名
  sex: string; // 用户性别
  email?: string; // 用户邮箱
  phone?: string; // 用户联系方式
  avatar?: string; // 用户头像
  roles: string[]; // 用户角色
  registerTime?: string; // 用户角色
}

export interface UserState {
  token: string; // 用户的认证 token
  userInfo: UserInfo; // 用户信息
  roles: string[]; // 有时候 roles 需要等拿到 userId，再去获取，则不会在 userInfo 里
}

@Module({ dynamic: true, store, name: "user", namespaced: true })
class User extends VuexModule implements UserState {
  public token: string = "admin-token";
  public userInfo: UserInfo = {
    userId: "v10001",
    userName: "Visitor",
    sex: "男",
    email: "2456019588@qq.com",
    phone: "13377492843",
    avatar: "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png",
    roles: ["visitor"],
    registerTime: "2022-10-01 19:07:27",
  };
  public roles: string[] = [];

  @Action
  public login() {
    let token = "admin-token";
    setCacheToken(token);
    this.SET_TOKEN(token);
  }

  @Action
  public async LogOut() {
    debugger;
    if (this.token === "") {
      throw Error("LogOut: token is undefined!");
    }
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
      userId: "v10001",
      userName: "Visitor",
      sex: "男",
      email: "2456019588@qq.com",
      phone: "13377492843",
      avatar: "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png",
      roles: ["visitor"],
      registerTime: "2022-10-01 19:07:27",
    };
    let roles: string[] = userInfo.roles || ["admin"];
    this.SET_ROLES(roles);
    this.setUserInfo(userInfo);
    return roles;
  }

  @Action
  public resetToken() {
    removeCacheToken();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async changeRoles(roles: string[]) {
    // 模拟新的 token
    const token = roles[0] + "-token";
    this.SET_TOKEN(token);
    setCacheToken(token);
    this.SET_ROLES(roles); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
    // await this.getUserInfo(token);
    resetRouter();
    loadRoutes(rolesRoutes, roles, router);
    LayoutModule.deleteAllTags();
  }

  @Action
  public setUserInfo(userInfo: UserInfo) {
    this.SET_USER_INFO(userInfo);
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
