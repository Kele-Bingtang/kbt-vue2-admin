import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";
import { Route } from "vue-router";
import { getSize, setSize, setLanguage } from "@/utils/cookies";
import { getLocale } from "@/locale";
import { UserModule } from "./user";

export interface Tag extends Partial<Route> {
  path: string;
}

// 自定义 Tag
// export interface Tag {
//   path: string; // 路由的 path
//   name: string; // 路由的 name
//   label: string; // 展示的描述
// }

export interface SideMenu {
  isCollapse: boolean; // 是否折叠菜单栏
}

export interface tagsNav {
  tagNavList: Array<Tag>; // 标签栏列表
  cachedTagList: string[]; // 缓存的路由组件
}

export interface ErrorLog {
  err: Error;
  vm: any;
  info: string;
  url: string;
  hasRead: boolean;
  userId?: string;
  userName?: string;
  token?: string;
  roles?: string[];
  time?: number;
}

export interface LayoutState {
  sideMenu: SideMenu; // 侧边菜单
  tagsNav: tagsNav; // 标签页
  size: string; // 布局大小
  language: string; // 语言
  errorLogs: Array<ErrorLog>; // 错误日志
}

@Module({ dynamic: true, store, name: "layout", namespaced: true })
class Layout extends VuexModule implements LayoutState {
  public sideMenu: SideMenu = {
    isCollapse: false,
  };
  public tagsNav: tagsNav = {
    tagNavList: [],
    cachedTagList: [],
  };

  public size: string = getSize() || "medium";

  public language = getLocale() || "zh-CN";

  public errorLogs: Array<ErrorLog> = [];

  // 折叠或者隐藏菜单栏
  @Action
  public toggleSiderBar() {
    this.TOGGLE_SIDEMENU();
  }

  @Action
  public setSize(size: string) {
    this.SET_SIZE(size);
  }

  @Action
  public setLanguage(language: string) {
    this.SET_LANGUAGE(language);
  }

  @Action
  public addErrorLog(errorLog: ErrorLog) {
    this.ADD_ERROR_LOG(errorLog);
  }

  @Action
  public deleteOneErrorLog(errorLog: ErrorLog) {
    this.DELETE_ONE_ERROR_LOG(errorLog);
  }

  @Action
  public clearErrorLog() {
    this.CLEAR_ERROR_LOG();
  }

  @Action
  public setHasReadErrorLogsStatus(status: boolean = false) {
    this.SET_HAS_READ_ERROR_LOGS_STATUS(status);
  }

  @Action
  public addTag(tag: Tag) {
    this.ADD_VISITED_TAG(tag);
    this.ADD_CACHED_TAG(tag);
  }

  @Action
  public addVisitedTag(tag: Tag) {
    this.ADD_VISITED_TAG(tag);
  }

  @Action
  public deleteTag(tag: Tag) {
    this.DELETE_VISITED_TAG(tag);
    this.DELETE_CACHED_TAG(tag);
  }

  @Action
  public deleteCachedTag(tag: Tag) {
    this.DELETE_CACHED_TAG(tag);
  }

  @Action
  public deleteOthersTags(tag: Tag) {
    this.DELETE_OTHERS_VISITED_TAGS(tag);
    this.DELETE_OTHERS_CACHED_TAGS(tag);
  }

  @Action
  public deleteAllTags() {
    this.DELETE_ALL_VISITED_TAGS();
    this.DELETE_ALL_CACHED_TAGS();
  }

  @Action
  public deleteAllCachedTags() {
    this.DELETE_ALL_CACHED_TAGS();
  }

  @Action
  public updateVisitedTag(tag: Tag) {
    this.UPDATE_VISITED_TAG(tag);
  }

  @Mutation
  private TOGGLE_SIDEMENU() {
    this.sideMenu.isCollapse = !this.sideMenu.isCollapse;
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size;
    setSize(this.size);
  }

  @Mutation
  private ADD_ERROR_LOG(errorLog: ErrorLog) {
    let { userInfo, token, roles } = UserModule;
    let log: ErrorLog = {
      ...errorLog,
      userId: userInfo.userId,
      userName: userInfo.userName,
      token,
      roles,
      time: new Date().getTime(),
    };
    this.errorLogs.push(log);
  }

  @Mutation
  private DELETE_ONE_ERROR_LOG(errorLog: ErrorLog) {
    for (const [i, e] of this.errorLogs.entries()) {
      if (e.time === errorLog.time) {
        this.errorLogs.splice(i, 1);
        break;
      }
    }
  }

  @Mutation
  private CLEAR_ERROR_LOG() {
    this.errorLogs.splice(0);
  }

  @Mutation
  private SET_HAS_READ_ERROR_LOGS_STATUS(status: boolean) {
    this.errorLogs = this.errorLogs.map((errorLog) => {
      errorLog.hasRead = status;
      return errorLog;
    })
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language;
    setLanguage(this.language);
  }

  @Mutation
  private ADD_VISITED_TAG(tag: Tag) {
    if (this.tagsNav.tagNavList.some((v) => v.path === tag.path)) return;
    this.tagsNav.tagNavList.push(tag);
  }

  @Mutation
  private ADD_CACHED_TAG(tag: Tag) {
    if (!tag.name) return;
    if (this.tagsNav.cachedTagList.includes(tag.name)) return;
    if (!tag.meta || (tag.meta && !tag.meta.noCache)) {
      this.tagsNav.cachedTagList.push(tag.name);
    }
  }

  @Mutation
  private DELETE_VISITED_TAG(tag: Tag) {
    for (const [i, v] of this.tagsNav.tagNavList.entries()) {
      if (v.path === tag.path) {
        this.tagsNav.tagNavList.splice(i, 1);
        break;
      }
    }
  }

  @Mutation
  private DELETE_CACHED_TAG(tag: Tag) {
    if (!tag.name) return;
    const index = this.tagsNav.cachedTagList.indexOf(tag.name);
    index > -1 && this.tagsNav.cachedTagList.splice(index, 1);
  }

  @Mutation
  private DELETE_OTHERS_VISITED_TAGS(tag: Tag) {
    this.tagsNav.tagNavList = this.tagsNav.tagNavList.filter((v) => {
      return (v.meta && v.meta.fixedInNav) || v.path === tag.path;
    });
  }

  @Mutation
  private DELETE_OTHERS_CACHED_TAGS(tag: Tag) {
    if (!tag.name) return;
    const index = this.tagsNav.cachedTagList.indexOf(tag.name);
    if (index > -1) {
      this.tagsNav.cachedTagList = this.tagsNav.cachedTagList.slice(
        index,
        index + 1
      );
    } else {
      this.tagsNav.cachedTagList = [];
    }
  }

  @Mutation
  private DELETE_ALL_VISITED_TAGS() {
    // 除了 fixedInNav 的 tag，其他删掉
    const fixedTags = this.tagsNav.tagNavList.filter(
      (tag) => tag.meta && tag.meta.fixedInNav
    );
    this.tagsNav.tagNavList = fixedTags;
  }

  @Mutation
  private DELETE_ALL_CACHED_TAGS() {
    this.tagsNav.cachedTagList = [];
  }

  @Mutation
  private UPDATE_VISITED_TAG(tag: Tag) {
    for (let v of this.tagsNav.tagNavList) {
      if (v.path === tag.path) {
        v = Object.assign(v, tag);
        break;
      }
    }
  }
}

export const LayoutModule = getModule(Layout);
