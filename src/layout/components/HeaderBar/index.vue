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
import SideMenuTrigger from "./components/SideMenuTrigger.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import { RedirectOption, Route, RouteConfig, RouteRecord } from "vue-router";
import { PermissionModule } from "@/store/modules/permission";

export interface Breadcrumbs extends Route {
  redirect?: RedirectOption;
}

@Component({
  components: {
    SideMenuTrigger,
    Breadcrumb,
  },
})
export default class HeaderBar extends Vue {
  public breadcrumbs: Array<Breadcrumbs> = [];

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
      return [homeRoute as Breadcrumbs];
    }
    matched = homeRoute ? [homeRoute as RouteRecord].concat(matched) : matched;
    let routeMatched: Array<Breadcrumbs> = [];
    /**
     * 如果 route.meta.title 是 function，那么需要 route 的信息，所以将 matched 转成 route，一个面包屑就是一个 route
     * 因为 matched 专门存放匹配的路由 path、name、meta，所以这是匹配路由唯一的，而其他就是 route 唯一，两者并不重复且冲突
     * 因为需要 redirect，所以 Breadcrumbs 类型是 route + redirect
     */
    matched.forEach((item) => {
      routeMatched.push({
        path: item.path,
        name: item.name,
        meta: item.meta,
        fullPath: item.meta._fullPath,
        redirect: item.redirect,
        matched,
        hash: this.$route.hash,
        params: this.$route.params,
        query: this.$route.query,
        redirectedFrom: this.$route.redirectedFrom,
      });
    });
    return routeMatched.filter((item) => {
      return (
        (item.name || (item.meta && item.meta.title)) &&
        item.meta &&
        !item.meta.hideInBread
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
  border-bottom: 1px solid #e8eaec;
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
      vertical-align: text-bottom;
      &:hover {
        cursor: pointer;
        transition: background 0.3s;
      }
    }
  }
}
</style>

<style lang="scss">
.header-bar {
  .right-menu {
    .svg-container {
      .el-button {
        padding: 0;
        border: none;
      }
    }
  }
}
</style>
