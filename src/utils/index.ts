import config from "@/config/settings";
import { Tag } from "@/store/modules/layout";
import { Route, RouteConfig, RouteRecord } from "vue-router";

const { title, useI18n } = config;

// 判断是否是移动端还是 PC 端，true 是移动端，反之是 PC 端
export function isMobile() {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return flag;
}

/**
 * 去重
 * @param arr 多个对象的数组
 * @param removeKeys 去重的 keys，数组形式
 * @param keyIsAndOr and：所有 key 都重复才去重；or：所有 key 中，任意一个 key 重复就去重
 * @returns
 */
export function removeDuplicateObj<T>(
  arr: Array<T>,
  removeKeys: string[],
  keyIsAndOr: "and" | "or" = "and"
) {
  try {
    return arr.reduce((itemArr: any, next: any) => {
      const isSame = itemArr.find((item: any) => {
        if (keyIsAndOr === "and") {
          let isSame: boolean = true;
          removeKeys.forEach((key) => {
            if (item[key] !== next[key]) {
              isSame = false;
            }
          });
          return isSame;
        } else {
          let isSame: boolean = false;
          removeKeys.forEach((key) => {
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
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue 实例
 */
export const setTitle = (route: Route, vm: any) => {
  const pageTitle = showTitle(route, vm);
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
  window.document.title = resTitle;
};

/**
 * 处理页面标题、侧边菜单、面包屑、tagsNav 展示的 title
 */
export const showTitle = (
  route: Route | RouteConfig | RouteRecord | Tag,
  vm: any
) => {
  let title = "";
  let __titleIsFunction__ = false;
  // 如果路由没有 meta 或者 meta 没有 title，则以 name 为 title
  if (!(route.meta && route.meta.title)) {
    title = route.name || "no-name";
  } else {
    route = handleRouteTitle(route as Route);
    // 进入 else 代表 route.meta 必定存在
    title = route.meta!.title;
    __titleIsFunction__ = route.meta!.__titleIsFunction__;
  }
  // name 如果有 $noUseI18n-，代表不使用多语言 I18n
  let noUseI18n = route.name && route.name.startsWith("$noUseI18n-");
  if (useI18n && !noUseI18n) {
    if (title.includes("{{") && title.includes("}}") && useI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m: any, str: string) =>
        str.replace(/{{([\s\S]*)}}/, (m: any, _: string) => vm.$t(_.trim()))
      );
    } else if (!__titleIsFunction__ && route.name) {
      title = vm.$t(`$route.${route.name}`);
      // 如果转换多语言后，还是 $route.${route.name}，代表没有配置多语言，然后把 $route. 去掉
      title = title === `$route.${route.name}` ? route.name : title;
    }
  } else {
    if (!(route.meta && route.meta.title) && title.startsWith("$noUseI18n-")) {
      title = title.slice("$noUseI18n_".length);
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

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = (list: any) => {
  localStorage.tagNaveList = JSON.stringify(list);
};

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};
