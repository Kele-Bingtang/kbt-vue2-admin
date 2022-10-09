import Vue from "vue";
import { LayoutModule } from "@/store/modules/layout";
import { isArray } from "@/utils/validate";
import settings from "@/config/settings";

const { errorLog } = settings;

const { env } = errorLog;

const checkNeed = () => {
  const node_env = process.env.NODE_ENV;
  if (isArray(env) && node_env) {
    return env.includes(node_env);
  }
  return false;
};

export const errorHandler = (err: Error, vm: Vue, info: string) => {
  LayoutModule.addErrorLog({
    err,
    vm,
    info,
    url: window.location.href,
    hasRead: false,
  });
};

if (checkNeed()) {
  Vue.config.errorHandler = errorHandler;
  (Vue.prototype as any).$throw = (err: Error, vm: Vue, info: string) =>
    errorHandler(err, vm, info);
}
