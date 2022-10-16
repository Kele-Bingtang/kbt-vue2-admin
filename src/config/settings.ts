interface Settings {
  title: string; // 配置显示在浏览器标签的 title
  showSettings: boolean; // 是否显示设置
  showTagsNav: boolean; // 是否使用 tagsNav
  showSideMenuLogo: boolean; // Controls siderbar logo display
  useI18n: boolean; // 是否使用国际化，默认为false，如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字
  recordTagsNav: boolean; // 是否记录打开过（没关闭）的 tags，下次打开会加载在 tagsNav
  sideMenuTextTheme: boolean; // 如果是 true，则菜单的激活色跟随系统颜色
  theme: string; // 主题色
  sideMenuTheme: "dark" | "light"; // 侧边菜单栏的主题色，暗色和亮色，默认为暗色
  errorLog: {
    showInHeader: boolean; // 设为 false 后不会在顶部显示错误日志徽标
    env: string[]; // 日志收集的环境，默认是 production 生成环境
  };
  /**
   * 白名单额三种模式：["*"]、["next"]、[to.path, ...]
   * * 代表加载所有路由；next 代表直接放行，但不加载权限路由；to.path 表示指定的路由可以放行，可以填多个
   * 优先级：* > next > to.path
   */
  whiteList: string[];
}

const settings: Settings = {
  title: "kbt-vue-admin",
  showSettings: true,
  showTagsNav: true,
  showSideMenuLogo: true,
  useI18n: true,
  recordTagsNav: true,
  sideMenuTextTheme: true,
  theme: "#168BF7", // 蓝色偏暗：#168BF7，官方：#409EFF
  sideMenuTheme: "dark",
  errorLog: {
    showInHeader: true,
    env: ["development", "production"],
  },
  whiteList: ["*"],
};

export default settings;
