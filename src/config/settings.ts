interface Settings {
  title: string; // 配置显示在浏览器标签的 title
  showSettings: boolean; // 是否显示设置
  showTagsNav: boolean; // 是否使用 tagsNav
  showSideMenuLogo: boolean; // Controls siderbar logo display
  cookieExpires: number; // 菜单栏折叠、多语言、文字大小、sessionKey 在 Cookie 中存储的天数，默认 1 天
  useI18n: boolean; // 是否使用国际化，默认为false，如果不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'} 用来在菜单中显示文字
  sideMenuTextTheme: boolean; // 如果是 true，则菜单的激活色跟随系统颜色
  devServerPort: number; // Port number for webpack-dev-server
  errorLog: {
    showInHeader: boolean; // 设为 false 后不会在顶部显示错误日志徽标
    env: string[]; // 日志收集的环境，默认是 production 生成环境
  };
  /**
   * 白名单额三种模式：["*"]、["next"]、["to.path, ..."]
   * * 代表加载所有路由；next 代表直接放行，但不加载权限路由；to.path 表示指定的路由可以放心，可以填多个
   * 优先级：* > next > to.path
   */
  whiteList: string[];
}

const settings: Settings = {
  title: "kbt-vue-admin",
  showSettings: true,
  showTagsNav: true,
  showSideMenuLogo: true,
  cookieExpires: 1,
  useI18n: true,
  sideMenuTextTheme: true,
  devServerPort: 8097,
  errorLog: {
    showInHeader: true,
    env: ["development", "production"],
  },
  whiteList: ["*"],
};

export default settings;
