<template>
  <div class="layout" :class="classObj()">
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
            <full-screen />
            <error-log
              :errorCount="errorCount"
              :hasReadErrorLogs="hasReadErrorLogs"
            />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { HeaderBar, SideMenu, TagsNav, MainContent } from "./components";
import { isMobile, setTitle } from "@/utils/index";
import { LayoutModule } from "@/store/modules/layout";
import { SettingsModule } from "@/store/modules/settings";
import { Route } from "vue-router";
import SideMenuLogo from "./components/SideMenu/SideMenuLogo.vue";
import FullScreen from "./components/HeaderBar/FullScreen.vue";
import SizeSelect from "./components/HeaderBar/SizeSelect.vue";
import LangSelect from "./components/HeaderBar/LangSelect.vue";
import User from "./components/HeaderBar/User.vue";
import ErrorLog from "./components/HeaderBar/ErrorLog.vue";

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
  },
})
export default class Layout extends Vue {
  get showSettings() {
    return SettingsModule.showSettings;
  }
  // 是否显示 TagsNav
  get showTagsNav() {
    return SettingsModule.showTagsNav;
  }
  get isCollapse() {
    return LayoutModule.sideMenu.isCollapse;
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
    return LayoutModule.error.errorLogs.length;
  }

  get hasReadErrorLogs() {
    return LayoutModule.error.hasReadErrorLogs;
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
    this.$message({
      message: "修改语言成功",
      type: "success",
    });
  }

  public handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size;
    LayoutModule.setSize(size);
    this.refreshPage();
    this.$message({
      message: "修改尺寸成功",
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
@import "~@/styles/mixins.scss";
@import "~@/styles/variables.module.scss";
.layout {
  @include clearfix;
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
