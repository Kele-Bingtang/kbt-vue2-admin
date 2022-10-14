import VueI18n from "vue-i18n";
import Vue from "vue";

// 本地的语言包
import customZhCn from "./lang/zh-CN";
import customZhTw from "./lang/zh-TW";
import customEnUs from "./lang/en-US";
// 引入 element 的语言包
import zhCnLocale from "element-ui/lib/locale/lang/zh-CN"; // 中文
import zhTwLocale from "element-ui/lib/locale/lang/zh-TW"; // 台湾
import enLocale from "element-ui/lib/locale/lang/en"; // 英文
import { getCacheLanguage } from "@/utils/cache";

Vue.use(VueI18n);

const messages = {
  "zh-CN": {
    ...customZhCn,
    ...zhCnLocale,
  },
  "zh-TW": {
    ...customZhTw,
    ...zhTwLocale,
  },
  "en-US": {
    ...customEnUs,
    ...enLocale,
  },
};

export const getLocale = () => {
  const cookieLanguage = getCacheLanguage();
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage;
    return cookieLanguage;
  }
  // 自动根据浏览器系统语言设置语言
  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale;
      return locale;
    }
  }
  // 默认是中文
  return "zh-CN";
};

const i18n = new VueI18n({
  locale: getLocale(), // 语言标识
  messages,
});

export default i18n;
