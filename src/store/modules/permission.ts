import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { RouteConfig } from "vue-router";
import { constantRoutes } from "@/router/routes-config";
import { isExternal } from "@/utils/validate";

export interface PermissionState {
  rolesRoutes: Array<RouteConfig>; // 当前用户独有的权限路由表
  loadRoutes: Array<RouteConfig>; // 当前用户所有的权限路由表（包含基础路由）
  homeRoute: RouteConfig; // 首页的路由
  isLoadedRoutes: boolean; // 是否已经加载完路由
}

@Module({ dynamic: true, store, name: "permission", namespaced: true })
class Permission extends VuexModule implements PermissionState {
  public rolesRoutes: Array<RouteConfig> = [];
  public loadRoutes: Array<RouteConfig> = [];
  public homeRoute: RouteConfig = {
    path: "",
    name: "",
  };
  public isLoadedRoutes: boolean = false;

  @Action
  public loadRolesRoutes(routes: Array<RouteConfig>) {
    this.SET_ROUTES(routes);
  }

  @Mutation
  private SET_ROUTES(routes: Array<RouteConfig>) {
    let fullPathConstantRoutes = getRouteFullPath(constantRoutes);
    let fullPathRolesRoutes = getRouteFullPath(routes);
    this.loadRoutes = fullPathConstantRoutes.concat(fullPathRolesRoutes);
    this.rolesRoutes = fullPathRolesRoutes;
    this.homeRoute = getHomeRoute(this.loadRoutes, "Home"); // 路由里首页的 name 值，必须填且正确，默认为 Home
    this.isLoadedRoutes = true;
  }
}

export const PermissionModule = getModule(Permission);

/**
 * 父路由的完整 path（_fullPath）是本身的 path
 * 子路由的完整 path（_fullPath）是父路由的 path 加子路由的 path
 * _fullPath 放在 meta 里，因为避免开发人员需要用到 fullPath，所以加个 $ 代表关键字
 * 因为目前菜单的跳转是基于 path，如果你觉得下面函数计算完整的 path 比较麻烦，可以直接以 name 跳转：在 @/layout/components/SideMenu/SideMenuItemLink 里修改为 name 即可
 */
export const getRouteFullPath = (routes: Array<RouteConfig>, basePath = "/") => {
  return routes.map(route => {
    if (!(route.meta && route.meta._fullPath)) {
      let { meta } = route;
      meta = meta || {};
      // 一级路由的 _fullPath 是自己的 path，如果 path 自带 /，则不需要路由拼接
      if (route.path.startsWith("/")) {
        meta._fullPath = route.path;
      } else {
        let fullPath = basePath + "/" + route.path;
        // 去掉多余的 /，保证 path 是合法的地址，合法如 /home/index，不合法如：//home//index
        meta._fullPath = fullPath!.replace(/\/+/g, "/");
      }
      route.meta = meta;
    }
    if (route.children && route.children.length > 0) {
      // 如果是 http 链接，不需要路由拼接
      if (isExternal(route.meta._fullPath)) {
        route.children = getRouteFullPath(route.children, "");
      } else {
        route.children = getRouteFullPath(route.children, route.meta && route.meta._fullPath);
      }
    }
    return route;
  });
};

/**
 * 用于找到路由列表中 name 为 home 的对象
 * 如果你的首页 name 不为 home，请更改
 */
export const getHomeRoute = (routes: Array<RouteConfig>, homeName = "home"): RouteConfig => {
  let homeRoute: RouteConfig = {
    name: "",
    path: "",
  };
  for (const route of routes) {
    if (route.children && route.children.length > 0) {
      let res = getHomeRoute(route.children, homeName);
      if (res && res.name) return res;
    } else {
      if (route.name === homeName) homeRoute = route;
    }
  }
  return homeRoute;
};
