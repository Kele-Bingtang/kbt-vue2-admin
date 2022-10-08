import { RouteConfig } from "vue-router";

/**
 * 过滤出当前系统角色的路由权限
 * @param routes
 * @param roles
 * @returns
 */
export const filterOnlyRolesRoutes = (
  routes: Array<RouteConfig>,
  roles: string[]
) => {
  const rolesRoutes: RouteConfig[] = [];
  routes.forEach((route) => {
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
 * @param roles 系统角色
 * @param route 当前路由
 * @returns
 */
const hasPermission = (route: RouteConfig, roles: string[]) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta!.roles.includes(role));
  } else {
    return true; // 没有添加权限验证
  }
};
