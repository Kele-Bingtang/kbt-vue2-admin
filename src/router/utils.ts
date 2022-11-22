import { PermissionModule } from "@/store/modules/permission";
import VueRouter, { RouteConfig } from "vue-router";

/**
 * 动态加载路由
 */
export const loadRoutes = (routes: RouteConfig[], roles: string[], router: VueRouter) => {
  const onlyRolesRoutes = filterOnlyRolesRoutes(routes, roles);
  PermissionModule.loadRolesRoutes(onlyRolesRoutes);
  onlyRolesRoutes.forEach(route => {
    router.addRoute(route);
  });
};

/**
 * 过滤出当前系统角色的路由权限
 */
export const filterOnlyRolesRoutes = (routes: Array<RouteConfig>, roles: string[]) => {
  const rolesRoutes: RouteConfig[] = [];
  routes.forEach(route => {
    const r = { ...route };
    if (hasPermission(r, roles)) {
      if (r.children && r.children.length !== 0) {
        r.children = filterOnlyRolesRoutes(r.children, roles);
      }
      rolesRoutes.push(r);
    }
  });
  return rolesRoutes;
};

/**
 * 该系统角色是否有权限访问当前路由
 * roles 带有 * 的代表所有路由都能访问
 */
const hasPermission = (route: RouteConfig, roles: string[]) => {
  if (roles.includes("*")) {
    return true;
  }
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta && route.meta.roles.includes(role));
  } else {
    return true; // 没有添加权限验证
  }
};
