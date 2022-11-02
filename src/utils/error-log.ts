import Vue from "vue";
import { LayoutModule } from "@/store/modules/layout";
import { isArray } from "@/utils/validate";
import settings from "@/config/settings";

const { errorLog } = settings;

const { env } = errorLog;

/**
 * 检查当前环境是否符合错误日志的运行
 */
const checkNeed = () => {
  const node_env = process.env.NODE_ENV;
  if (isArray(env) && node_env) {
    return env.includes(node_env);
  }
  return false;
};

/**
 * 捕获错误回调
 */
export const errorHandler = (err: Error, vm: Vue, info: string) => {
  LayoutModule.addErrorLog({
    err,
    vm,
    info,
    url: window.location.href,
    hasRead: false,
  });
};

/**
 * 捕获日志
 */
if (checkNeed()) {
  Vue.config.errorHandler = errorHandler;
}

(Vue.prototype as any).$throw = (err: Error, vm: Vue, info: string) => errorHandler(err, vm, info);
