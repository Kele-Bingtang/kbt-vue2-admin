<template>
  <div class="header-bar">
    <side-menu-trigger
      :is-collapse="isCollapse"
      @toggle-trigger="toggleTrigger"
      class="side-menu-trigger-container"
    />
    <breadcrumb :breadcrumbs="breadcrumbs" class="breadcrumb-container" />
    <div class="right-menu">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { LayoutModule } from "@/store/modules/layout";
import { Component, Vue, Watch } from "vue-property-decorator";
import SideMenuTrigger from "./SideMenuTrigger.vue";
import Breadcrumb from "./Breadcrumb.vue";
import { Route, RouteConfig, RouteRecord } from "vue-router";
import { PermissionModule } from "@/store/modules/permission";

@Component({
  components: {
    SideMenuTrigger,
    Breadcrumb,
  },
})
export default class HeaderBar extends Vue {
  public breadcrumbs: Array<RouteRecord> = [];

  private homeRoute: RouteConfig = {
    path: "",
    name: "",
  };

  // 获取是否展开菜单栏的布尔值
  get isCollapse(): boolean {
    return LayoutModule.sideMenu.isCollapse;
  }

  @Watch("$route")
  public onRouteChange(route: Route) {
    if (route.path && route.path.startsWith("/redirect/")) {
      return;
    }
    this.breadcrumbs = this.getBreadcrumbs(PermissionModule.homeRoute);
  }

  created() {
    this.breadcrumbs = this.getBreadcrumbs(PermissionModule.homeRoute);
  }

  // 折叠或者展开菜单栏
  public toggleTrigger() {
    LayoutModule.toggleSiderBar();
  }

  /**
   * 获取面包屑列表
   */
  private getBreadcrumbs(homeRoute: RouteConfig) {
    let matched = this.$route.matched;
    // 如果是首页，直接返回
    if (homeRoute && matched.some((item) => item.name === homeRoute.name)) {
      return [homeRoute as RouteRecord];
    }
    matched = homeRoute ? [homeRoute as RouteRecord].concat(matched) : matched;
    return matched.filter((item) => {
      return (
        (item.name || (item.meta && item.meta.title)) &&
        item.meta &&
        !item.meta.hiddenInBread
      );
    });
  }
}
</script>

<style lang="scss" scoped>
.header-bar {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.07);
  border: 1px solid #e8eaec;
  .side-menu-trigger-container {
    float: left;
    line-height: 46px;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
    transition: all 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    & > * {
      display: inline-block;
      margin: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &:hover {
        cursor: pointer;
        transition: background 0.3s;
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
}
</style>
