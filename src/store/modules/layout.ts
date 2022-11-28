import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { Route } from "vue-router";
import {
  getCacheSize,
  setCacheSize,
  setCacheLanguage,
  setCacheSideMenuStatus,
  getCacheSideMenuStatus,
  setCacheTagNavList,
  getCacheTagNavList,
} from "@/utils/cache";
import { getLocale } from "@/locale";
import { UserModule } from "./user";
import { SettingsModule } from "./settings";

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

export enum DeviceType {
  Mobile = "mobile", // 移动端
  Desktop = "desktop", // 桌面端
}

export interface ErrorLog {
  err: Error; // 错误对象
  vm: any; // 发生错误的 Vue 实例
  info: string; // Vue 组件的错误信息
  url: string; // 发生错误的 URL
  hasRead: boolean; // 错误日志是否已读
  time?: number; // 发生错误的时间
  userId?: string; // 用户 ID
  userName?: string; // 用户名
  token?: string; // 用户 token
  roles?: string[]; // 用户的角色
}

export interface LayoutState {
  device: DeviceType; // 设备类型
  sideMenu: SideMenu; // 侧边菜单
  tagsNav: tagsNav; // 标签页
  size: string; // 布局大小
  language: string; // 语言
  errorLogs: Array<ErrorLog>; // 错误日志
}

@Module({ dynamic: true, store, name: "layout", namespaced: true })
class Layout extends VuexModule implements LayoutState {
  public sideMenu: SideMenu = {
    isCollapse: getCacheSideMenuStatus() === "collapse",
  };
  public tagsNav: tagsNav = {
    tagNavList: getCacheTagNavList() || [],
    cachedTagList: [],
  };
  public device = DeviceType.Desktop;
  public size: string = getCacheSize() || "medium";
  public language = getLocale() || "zh-CN";
  public errorLogs: Array<ErrorLog> = [];

  @Action
  public closeSideMenu() {
    this.CLOSE_SIDE_MENU();
  }

  @Action
  public toggleSideMenu() {
    this.TOGGLE_SIDE_MENU();
  }

  @Action
  public toggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device);
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
    this.CACHE_TAG_NAV_LIST();
  }

  @Action
  public deleteTag(tag: Tag) {
    this.DELETE_VISITED_TAG(tag);
    this.DELETE_CACHED_TAG(tag);
    this.CACHE_TAG_NAV_LIST();
  }

  @Action
  public deleteCachedTag(tag: Tag) {
    this.DELETE_CACHED_TAG(tag);
  }

  @Action
  public deleteOthersTags(tag: Tag) {
    this.DELETE_OTHERS_VISITED_TAGS(tag);
    this.DELETE_OTHERS_CACHED_TAGS(tag);
    this.CACHE_TAG_NAV_LIST();
  }

  @Action
  public deleteAllTags() {
    this.DELETE_ALL_VISITED_TAGS();
    this.DELETE_ALL_CACHED_TAGS();
    this.CACHE_TAG_NAV_LIST();
  }

  @Action
  public deleteAllCachedTags() {
    this.DELETE_ALL_CACHED_TAGS();
  }

  @Action
  public updateVisitedTag(tag: Tag) {
    this.UPDATE_VISITED_TAG(tag);
    this.CACHE_TAG_NAV_LIST();
  }

  @Mutation
  public CLOSE_SIDE_MENU() {
    this.sideMenu.isCollapse = true;
  }

  @Mutation
  private TOGGLE_SIDE_MENU() {
    this.sideMenu.isCollapse = !this.sideMenu.isCollapse;
    if (this.sideMenu.isCollapse) {
      setCacheSideMenuStatus("collapse");
    } else {
      setCacheSideMenuStatus("expand");
    }
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device;
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size;
    setCacheSize(this.size);
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
    this.errorLogs = this.errorLogs.map(errorLog => {
      errorLog.hasRead = status;
      return errorLog;
    });
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language;
    setCacheLanguage(this.language);
  }

  @Mutation
  private ADD_VISITED_TAG(tag: Tag) {
    tag.path = decodeURIComponent(tag.path); // 存储的 tag.path 是解码后的
    if (this.tagsNav.tagNavList.some(v => v.path === tag.path || v.path + "/" === tag.path)) return;
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
    this.tagsNav.tagNavList = this.tagsNav.tagNavList.filter(v => {
      return (v.meta && v.meta.fixedInNav) || v.path === tag.path;
    });
  }

  @Mutation
  private DELETE_OTHERS_CACHED_TAGS(tag: Tag) {
    if (!tag.name) return;
    const index = this.tagsNav.cachedTagList.indexOf(tag.name);
    if (index > -1) {
      this.tagsNav.cachedTagList = this.tagsNav.cachedTagList.slice(index, index + 1);
    } else {
      this.tagsNav.cachedTagList = [];
    }
  }

  @Mutation
  private DELETE_ALL_VISITED_TAGS() {
    // 除了 fixedInNav 的 tag，其他删掉
    const fixedTags = this.tagsNav.tagNavList.filter(tag => tag.meta && tag.meta.fixedInNav);
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

  // 缓存 TagsNav 的所有 tag
  @Mutation
  private CACHE_TAG_NAV_LIST() {
    if (SettingsModule.recordTagsNav) {
      let tagNavList: Array<Tag> = [];
      this.tagsNav.tagNavList.forEach(item => {
        tagNavList.push({
          ...item,
          matched: [], // 需要置为空，否则 matched 存在对其他路由的依赖，导致 JSON 转换失败
        });
      });
      setCacheTagNavList(tagNavList);
    }
  }
}

export const LayoutModule = getModule(Layout);
