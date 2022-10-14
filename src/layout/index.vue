<template>
  <div class="layout" :class="classObj()" :style="{ '--current-color': theme }">
    <el-container class="layout-container">
      <!-- 侧边菜单栏 -->
      <el-aside
        class="side-menu-container"
        :class="{ 'side-menu-collapse': isCollapse }"
      >
        <side-menu>
          <side-menu-logo v-if="showLogo" :is-collapse="isCollapse" />
        </side-menu>
      </el-aside>

      <el-container>
        <!-- 头部 -->
        <el-header class="header-container">
          <header-bar>
            <global-settings />
            <full-screen />
            <error-log :errorCount="errorCount" />
            <size-select :size="size" @handleSetSize="handleSetSize" />
            <lang-select
              :language="language"
              @handleSetLanguage="handleSetLanguage"
            />
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
    <theme-picker
      v-if="theme.toLowerCase() !== settings.theme.toLowerCase()"
      v-show="false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HeaderBar, SideMenu, TagsNav, MainContent } from "./components";
import { isMobile, setTitle } from "@/utils/layout";
import { LayoutModule } from "@/store/modules/layout";
import { SettingsModule } from "@/store/modules/settings";
import SideMenuLogo from "./components/SideMenu/SideMenuLogo.vue";
import FullScreen from "./components/HeaderBar/components/FullScreen.vue";
import SizeSelect from "./components/HeaderBar/components/SizeSelect.vue";
import LangSelect from "./components/HeaderBar/components/LangSelect.vue";
import User from "./components/HeaderBar/components/User.vue";
import ErrorLog from "./components/HeaderBar/components/ErrorLog.vue";
import GlobalSettings from "./components/HeaderBar/components/GlobalSettings.vue";
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
    GlobalSettings,
    ThemePicker,
  },
})
export default class Layout extends Vue {
  get isCollapse() {
    return LayoutModule.sideMenu.isCollapse;
  }

  get settings() {
    return settings;
  }

  get theme() {
    return SettingsModule.theme;
  }

  get showSettings() {
    return SettingsModule.showSettings;
  }
  // 是否显示 TagsNav
  get showTagsNav() {
    return SettingsModule.showTagsNav;
  }
  // 是否显示 logo
  get showLogo() {
    return SettingsModule.showSideMenuLogo;
  }

  get isMobile() {
    return isMobile() == null;
  }

  get language() {
    return LayoutModule.language;
  }

  get size() {
    return LayoutModule.size;
  }

  get errorCount() {
    let noReadErrorLogs = LayoutModule.errorLogs.filter((errorLog) => {
      return !errorLog.hasRead;
    });
    return noReadErrorLogs.length;
  }

  // future（目前没有实现，未来打算实现）：菜单栏适配手机端
  public classObj() {
    return {
      // mobileSideMenu: isMobile(),
      // pcSideMenu: !isMobile(),
      // hideSideMenu: !this.isCollapse,
      // openSideMenu: this.isCollapse,
    };
  }

  public handleSetLanguage(lang: string) {
    this.$i18n.locale = lang;
    LayoutModule.setLanguage(lang);
    document.documentElement.lang = lang;
    setTitle(this.$route, this);
    let message = this.$t("_headerBar.changeLanguage");
    message =
      message === "_headerBar.changeLanguage" ? "修改语言成功！" : message;
    this.$message({
      message: message as string,
      type: "success",
    });
  }

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

  private refreshPage() {
    // 重新渲染整个页面
    LayoutModule.deleteAllCachedTags();
    const { fullPath } = this.$route;
    this.$nextTick(() => {
      this.$router
        .replace({
          path: "/redirect" + fullPath,
        })
        .catch((err) => {
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
  }
  .side-menu-container {
    transition: width 0.28s;
    width: $sideMenuWidth !important;
    box-shadow: 0 1px 4px rgb(0 21 41 / 9%);
  }
  .side-menu-collapse {
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

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideMenuWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideMenuWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
