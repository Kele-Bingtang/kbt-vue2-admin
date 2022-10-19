import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { removeCacheToken, setCacheToken } from "@/utils/cache";
import { resetRouter } from "@/router";
import { LayoutModule } from "./layout";
import { readedList, recycleList, unreadList } from "@/test/message";

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

export interface Message {
  id: string;
  title: string;
  content: string;
  createTime: string;
  loading?: boolean;
}

export interface MessageStore {
  unreadList: Array<Message>;
  readedList: Array<Message>;
  recycleList: Array<Message>;
}

export interface UserState {
  token: string; // 用户的认证 token
  userInfo: UserInfo; // 用户信息
  roles: string[]; // 有时候 roles 需要等拿到 userId，再去获取，则不会在 userInfo 里
  message: MessageStore;
}

@Module({ dynamic: true, store, name: "user", namespaced: true })
class User extends VuexModule implements UserState {
  public token: string = "";
  public userInfo: UserInfo = {
    userId: "v10001",
    userName: "Visitor",
    sex: "男",
    email: "2456019588@qq.com",
    phone: "13377492843",
    avatar: "https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png",
    roles: ["Visitor"],
    registerTime: "2022-10-01 19:07:27",
  };
  public roles: string[] = [];
  public message: MessageStore = {
    unreadList: [],
    readedList: [],
    recycleList: [],
  };

  @Action
  public login() {
    let token = "1";
    setCacheToken(token);
    this.SET_TOKEN(token);
  }

  @Action
  public async LogOut() {
    debugger
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
      userId: "k100338",
      userName: "Kobe Liu",
      sex: "男",
      roles: ["admin"],
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
  public changeRoles(roles: string[]) {
    this.SET_ROLES(roles);
  }

  @Action
  public setUserInfo(userInfo: UserInfo) {
    this.SET_USER_INFO(userInfo);
  }

  // 获取消息列表，其中包含未读、已读、回收站三个列表
  @Action
  public getMessageList() {
    return new Promise((resolve, reject) => {
      // 模拟请求消息
      this.SET_MESSAGE_UNREAD_LIST(unreadList);
      this.SET_MESSAGE_READED_LIST(readedList);
      this.SET_MESSAGE_RECYCLE_LIST(recycleList);
      resolve("");
    });
  }

  // 把一个未读消息标记为已读
  @Action
  public messageHasRead({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "readedList",
        from: "unreadList",
        id,
      });
      resolve("");
    });
  }

  // 删除一个已读消息到回收站
  @Action
  public removeReadedMessage({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "recycleList",
        from: "readedList",
        id,
      });
      resolve("");
    });
  }

  // 还原一个已删除消息到已读消息
  @Action
  restoreRecycleMessage({ id }: { id: string }) {
    return new Promise((resolve, reject) => {
      this.MOVE_MESSAGE({
        to: "readedList",
        from: "recycleList",
        id,
      });
      resolve("");
    });
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

  @Mutation
  public SET_MESSAGE_UNREAD_LIST(unreadList: Array<Message>) {
    unreadList = unreadList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.unreadList = unreadList;
  }
  @Mutation
  public SET_MESSAGE_READED_LIST(readedList: Array<Message>) {
    readedList = readedList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.readedList = readedList;
  }
  @Mutation
  public SET_MESSAGE_RECYCLE_LIST(recycleList: Array<Message>) {
    recycleList = recycleList
      .map(item => {
        item.loading = false;
        return item;
      })
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    this.message.recycleList = recycleList;
  }
  @Mutation
  public MOVE_MESSAGE(messageRoute: {
    to: "readedList" | "recycleList";
    from: "unreadList" | "readedList" | "recycleList";
    id: string;
  }) {
    let { from, to, id } = messageRoute;
    const index = (this.message as any)[from].findIndex((item: Message) => item.id === id);
    const messageItem = (this.message as any)[from].splice(index, 1)[0];
    messageItem.loading = false;
    (this.message as any)[to].unshift(messageItem);
  }
}

export const UserModule = getModule(User);
