import config from "@/config/settings";
import { Tag } from "@/store/modules/layout";
import { SettingsModule } from "@/store/modules/settings";
import { UserModule } from "@/store/modules/user";
import { Route, RouteConfig, RouteRecord } from "vue-router";

const { title, routeUseI18n } = config;

/**
 * 去重
 * @param arr 多个对象的数组
 * @param removeKeys 去重的 keys，数组形式
 * @param keyIsAndOr and：所有 key 都重复才去重；or：所有 key 中，任意一个 key 重复就去重
 * @returns
 */
export function removeDuplicateObj<T>(arr: Array<T>, removeKeys: string[], keyIsAndOr: "and" | "or" = "and") {
  try {
    return arr.reduce((itemArr: any, next: any) => {
      const isSame = itemArr.find((item: any) => {
        if (keyIsAndOr === "and") {
          let isSame: boolean = true;
          removeKeys.forEach(key => {
            if (item[key] !== next[key]) {
              isSame = false;
            }
          });
          return isSame;
        } else {
          let isSame: boolean = false;
          removeKeys.forEach(key => {
            if (item[key] === next[key]) {
              isSame = true;
            }
          });
          return isSame;
        }
      });
      if (!isSame) {
        itemArr.push(next);
      }
      return itemArr;
    }, []);
  } catch (error) {
    return arr;
  }
}

/**
 * 根据当前跳转的路由设置显示在浏览器标签的 title
 */
export const setTitle = (route: Route, vm: any) => {
  const pageTitle = getTitle(route, vm);
  let resTitle = pageTitle ? `${title} - ${pageTitle}` : title; // 默认标题的模式
  let { titleMode } = SettingsModule;
  // 展示标题的多种模式判断
  if (titleMode === "0") {
    resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
  } else if (titleMode === "1") {
    const { userName } = UserModule.userInfo;
    if (userName && pageTitle) {
      resTitle = `${userName} - ${pageTitle}`;
    } else if (userName) {
      resTitle = `${title} - ${userName}`;
    } else if (pageTitle) {
      resTitle = resTitle;
    } else {
      resTitle = title;
    }
  } else if (titleMode === "2") {
    resTitle = title;
  } else if (titleMode === "3") {
    resTitle = pageTitle;
  }
  window.document.title = resTitle;
};

/**
 * 处理页面标题、侧边菜单、面包屑、tagsNav 展示的 title
 */
export const getTitle = (route: Route | RouteConfig | RouteRecord | Tag, vm: any) => {
  let title = "";
  let __titleIsFunction__ = false;
  // 如果路由没有 meta 或者 meta 没有 title，则以 name 为 title
  if (!(route.meta && route.meta.title)) {
    title = route.name || "no-name";
  } else {
    route = handleRouteTitle(route as Route);
    // 进入 else 代表 route.meta 必定存在
    title = route.meta && route.meta.title;
    __titleIsFunction__ = route.meta && route.meta.__titleIsFunction__ || false;
  }
  // name 如果有 $_noUseI18n_，代表不使用多语言 I18n
  let noUseI18n = route.name && route.name.startsWith("_noUseI18n_");
  if (routeUseI18n && !noUseI18n) {
    if (title.includes("{{") && title.includes("}}") && routeUseI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
        str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => vm.$t(_.trim()))
      );
    } else if (!__titleIsFunction__ && route.name) {
      title = vm.$t(`_route.${route.name}`);
      // 如果转换多语言后，还是 _route.${route.name}，代表没有配置多语言，然后把 _route. 去掉
      title = title === `_route.${route.name}` ? route.name : title;
    }
  } else {
    if (!(route.meta && route.meta.title) && title.startsWith("_noUseI18n_")) {
      title = title.slice("_noUseI18n_".length);
    }
  }
  return title;
};

/**
 * 处理路由的 title，因为 title 支持函数格式，所以这里解析出函数的返回值
 */
export const handleRouteTitle = (route: Route) => {
  let router = { ...route };
  let meta = { ...route.meta };
  let title = "";
  if (meta && meta.title) {
    if (typeof meta.title === "function") {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else {
      title = meta.title;
    }
    meta.title = title;
    router.meta = meta;
  }
  return router;
};
