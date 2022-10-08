import Vue from "vue";
import "@/styles/normalize.css"; // CSS Reset
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "@/locale";
import ElementUI from "element-ui";
import SvgIcon from "vue-svgicon";
import "@/icons/components";
import "@/styles/element-variables.scss";
import "@/styles/index.scss";
import { LayoutModule } from "@/store/modules/layout";
import "@/utils/error-log";

Vue.config.productionTip = false;

Vue.use(ElementUI, {
  i18n: (key: any, value: any) => i18n.t(key, value),
  size: LayoutModule.size, // 设置 element-ui 的样式尺寸
});

Vue.use(SvgIcon, {
  tagName: "svg-icon",
  defaultWidth: "1em",
  defaultHeight: "1em",
});

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
