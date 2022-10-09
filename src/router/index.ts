import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { constantRoutes, rolesRoutes } from "./routes-config";
import { getToken } from "@/utils/cookies";
import { loadRoutes } from "./utils";
import { UserModule } from "@/store/modules/user";
import { PermissionModule } from "@/store/modules/permission";
import { setTitle } from "@/utils";
import settings from "@/config/settings";

Vue.use(VueRouter);

const createRouter = () =>
  new VueRouter({
    mode: "history",
    base: process.env.VUE_APP_ROUTE_BASE,
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

const { whiteList } = settings;

router.beforeEach(async (to: Route, from: Route, next: any) => {
  let token = UserModule.token || getToken();
  if (token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (UserModule.roles.length === 0) {
        try {
          const roles = await UserModule.getUserInfo();
          if (!PermissionModule.isLoadedRoutes) {
            loadRoutes(rolesRoutes, roles);
          }
          next({ ...to, replace: true });
        } catch (err) {
          UserModule.ResetToken();
          // next(`/login?redirect=${to.path}`)
        }
      } else {
        next();
      }
    }
  } else {
    // 白清单
    if (whiteList.includes("*")) {
      if (!PermissionModule.isLoadedRoutes) {
        loadRoutes(rolesRoutes, ["*"]);
        next({ ...to, replace: true });
      } else {
        next();
      }
    } else if (whiteList.includes("next") || whiteList.includes(to.path)) {
      next();
    } else {
      // next(`/login?redirect=${to.path}`)
    }
  }
});

router.afterEach((to: Route) => {
  // 修改页面的 title
  setTitle(to, router.app);
  window.scrollTo(0, 0);
});

export default router;
