<template>
  <div class="layout" :class="{ mobile: isMobile() }" :style="{ '--current-color': theme }">
    <el-container
      class="layout-container"
      :class="{ 'side-menu-collapse': isCollapse, 'side-menu-expand': !isCollapse }"
    >
      <!-- 侧边菜单栏 -->
      <el-aside class="side-menu-container">
        <side-menu>
          <side-menu-logo v-if="showSideMenuLogo" :is-collapse="isCollapse" />
        </side-menu>
      </el-aside>
      <!-- 移动端打开菜单栏，空白处出现遮罩 -->
      <div v-if="isMobile() && !isCollapse" class="drawer-bg" @click="handleClickOutSide" />
      <el-container>
        <!-- 头部 -->
        <el-header class="header-container">
          <header-bar>
            <template v-if="device !== 'mobile'">
              <full-screen />
              <error-log :errorCount="errorCount" v-if="settings.errorLog.showInHeader" />
            </template>
            <size-select :size="size" @handleSetSize="handleSetSize" />
            <lang-select :language="language" @handleSetLanguage="handleSetLanguage" />
            <user style="margin-right: 33px"></user>
          </header-bar>
        </el-header>
        <!-- 内容 -->
        <el-main class="main-container">
          <tags-nav v-if="showTagsNav" />
          <main-content />
        </el-main>
      </el-container>
    </el-container>
    <!-- 如果曾选过主题色，则使用该组件来更新主题色，但是该组件不需要显示在页面 -->
    <theme-picker v-if="theme.toLowerCase() !== settings.theme.toLowerCase()" v-show="false" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { HeaderBar, SideMenu, TagsNav, MainContent } from "./components";
import { setTitle } from "@/utils/layout";
import { DeviceType, LayoutModule } from "@/store/modules/layout";
import { SettingsModule } from "@/store/modules/settings";
import SideMenuLogo from "./components/SideMenu/SideMenuLogo.vue";
import FullScreen from "./components/HeaderBar/components/FullScreen.vue";
import SizeSelect from "./components/HeaderBar/components/SizeSelect.vue";
import LangSelect from "./components/HeaderBar/components/LangSelect.vue";
import User from "./components/HeaderBar/components/User.vue";
import ErrorLog from "./components/HeaderBar/components/ErrorLog.vue";
import ThemePicker from "@/components/ThemePicker/ThemePicker.vue";
import settings from "@/config/settings";

@Component({
  components: {
    HeaderBar,
    TagsNav,
    SideMenu,
    MainContent,
    SideMenuLogo,
    FullScreen,
    SizeSelect,
    LangSelect,
    User,
    ErrorLog,
    ThemePicker,
  },
})
export default class Layout extends Vue {
  // 当前菜单是否折叠
  get isCollapse() {
    return LayoutModule.sideMenu.isCollapse;
  }
  // 获取全局设置
  get settings() {
    return settings;
  }
  // 获取主题色
  get theme() {
    return SettingsModule.theme;
  }
  // 是否显示 settings 配置
  get showSettings() {
    return SettingsModule.showSettings;
  }
  // 是否显示标签页
  get showTagsNav() {
    return SettingsModule.showTagsNav;
  }
  // 是否显示侧边菜单栏的 Logo
  get showSideMenuLogo() {
    return SettingsModule.showSideMenuLogo;
  }
  // 获取当前语言
  get language() {
    return LayoutModule.language;
  }
  // 获取当前 Element UI 的 size
  get size() {
    return LayoutModule.size;
  }
  // 获取错误日志的数量
  get errorCount() {
    let noReadErrorLogs = LayoutModule.errorLogs.filter(errorLog => {
      return !errorLog.hasRead;
    });
    return noReadErrorLogs.length;
  }
  // 获取当前设备为移动端还是桌面端
  get device() {
    return LayoutModule.device;
  }
  // 监听路由，判断当前设备是否为移动端
  @Watch("$route")
  public onRouteChange() {
    if (this.device === DeviceType.Mobile && !this.isCollapse) {
      LayoutModule.closeSideMenu();
    }
  }
  // 监听页面的大小变化
  beforeMount() {
    window.addEventListener("resize", this.resizeHandler);
  }
  // 判断是否为移动端
  mounted() {
    const isMobile = this.isMobile();
    if (isMobile) {
      LayoutModule.toggleDevice(DeviceType.Mobile);
      LayoutModule.closeSideMenu();
    }
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  }
  // 是否为移动端
  public isMobile() {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < 767; // 这里以 ipad Mini 的宽度为移动端的阈值
  }
  // 页面大小变化，判断是否为移动端，移动端默认关闭菜单栏
  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile();
      LayoutModule.toggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop);
      if (isMobile) {
        LayoutModule.closeSideMenu();
      }
    }
  }
  // 移动端端点击遮罩，关闭菜单栏
  public handleClickOutSide() {
    LayoutModule.closeSideMenu();
  }
  // 选择语言回调
  public handleSetLanguage(lang: string) {
    this.$i18n.locale = lang;
    LayoutModule.setLanguage(lang);
    document.documentElement.lang = lang;
    setTitle(this.$route, this);
    let message = this.$t("_headerBar.changeLanguage");
    message = message === "_headerBar.changeLanguage" ? "修改语言成功！" : message;
    this.$message({
      message: message as string,
      type: "success",
    });
  }
  // 选择 Element UI 的 size 回调
  public handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size;
    LayoutModule.setSize(size);
    this.refreshPage();
    let message = this.$t("_headerBar.changeSize");
    message = message === "_headerBar.changeSize" ? "修改尺寸成功！" : message;
    this.$message({
      message: message as string,
      type: "success",
    });
  }
  // 刷新页面
  private refreshPage() {
    // 重新渲染整个页面
    LayoutModule.deleteAllCachedTags();
    const { fullPath } = this.$route;
    this.$nextTick(() => {
      this.$router
        .replace({
          path: "/redirect" + fullPath,
        })
        .catch(err => {
          console.warn(err);
        });
    });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.module.scss";
.layout {
  position: relative;
  height: 100%;
  width: 100%;
  .layout-container {
    height: 100%;
    .drawer-bg {
      background: #000;
      opacity: 0.3;
      width: 100%;
      top: 0;
      height: 100%;
      position: absolute;
      z-index: 999;
    }
    .side-menu-container {
      height: 100%;
      transition: width 0.28s;
      z-index: 2000;
      box-shadow: 0 1px 4px rgb(0 21 41 / 9%);
    }
    &.side-menu-expand .side-menu-container {
      width: $sideMenuWidth !important;
    }
    &.side-menu-collapse .side-menu-container {
      transition-duration: 0.3s;
      width: 54px !important;
    }
    .header-container {
      height: 50px !important;
      padding: 0;
    }
    .main-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
    }
  }
}
/* 适配移动端 */
.mobile {
  .layout-container {
    .side-menu-container {
      position: fixed;
      top: 0;
      transition: transform 0.28s;
    }
    &.side-menu-collapse .side-menu-container {
      width: $sideMenuWidth !important;
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideMenuWidth, 0, 0);
    }
  }
}
</style>
