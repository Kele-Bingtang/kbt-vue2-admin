<template>
  <div class="side-menu" :style="sideMenuThemeStyle()">
    <slot></slot>
    <el-scrollbar wrap-class="side-menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sideMenuTheme === 'dark' ? variables.menuDarkBg : variables.menuLightBg"
        :text-color="sideMenuTheme === 'dark' ? variables.menuDarkText : variables.menuLightText"
        :active-text-color="theme"
        :collapse-transition="false"
      >
        <side-menu-item v-for="menu in menuList" :key="menu.name" :menu-item="menu" :is-collapse="isCollapse" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideMenuItem from "./SideMenuItem.vue";
import { LayoutModule } from "@/store/modules/layout";
import { PermissionModule } from "@/store/modules/permission";
import { RouteConfig } from "vue-router";
import variables from "@/styles/variables.module.scss";
import { SettingsModule } from "@/store/modules/settings";
import settings from "@/config/settings";

export type MenuRoute = RouteConfig & {
  meta: {
    _fullPath: string; // 完整的路由（针对二级路由以上）
  };
};

@Component({ name: "SideMenu", components: { SideMenuItem } })
export default class extends Vue {
  // 当前菜单是否折叠
  get isCollapse() {
    return LayoutModule.sideMenu.isCollapse;
  }
  // 获取菜单列表
  get menuList() {
    /**
     * 第一次是将 hideInMenu 和 Children 为 1 的过滤掉，第二次是将最终 Children 为 1 的过滤掉（可能第一次 Children 有多个，只有一个 hideInMenu 不为 true）
     *
     * 场景：alwaysShowRoot 为 false
     *    如果一个路由有一个子路由，那么菜单只渲染出该子路由
     *    如果一个路由有两个子路由，其中一个子路由为 hideInMenu 为 true，那么菜单只渲染出另一个子路由
     * 如果一个路由有两个子路由，且都不是 hideInMenu，那么两个子路由为二级菜单
     *
     * 如果您确保您的路由不会出现：多个子路由且只有一个 hideInMenu 不为 true，可以只过滤一次提升性能，即直接 return this.getMenuListByRouter(PermissionModule.loadRoutes);
     */
    if (settings.moreRouteChildrenHideInMenuThenOnlyOne) {
      let menu = this.getMenuListByRouter(PermissionModule.loadRoutes);
      return this.getMenuListByRouter(menu);
    } else {
      return this.getMenuListByRouter(PermissionModule.loadRoutes);
    }
  }
  // 对应菜单 Item 的 index，这样才能高亮
  get activeMenu() {
    const route = this.$route;
    const { meta, path } = route;
    if (meta && meta.activeMenu) {
      return meta.activeMenu;
    } else if (meta && meta._fullPath) {
      return meta._fullPath;
    }
    return path;
  }
  // 获取主题色
  get theme() {
    return SettingsModule.theme;
  }
  // 获取菜单主题色
  get sideMenuTheme() {
    return SettingsModule.sideMenuTheme;
  }
  // 获取全局样式
  get variables() {
    return variables;
  }
  // 菜单主题色，便于切换
  public sideMenuThemeStyle() {
    return {
      "--menu-hover": this.sideMenuTheme === "dark" ? variables.menuDarkHover : variables.menuLightHover,
      "--sub-menu-bg": this.sideMenuTheme === "dark" ? variables.subMenuDarkBg : variables.subMenuLightBg,
      "--sub-menu-hover": this.sideMenuTheme === "dark" ? variables.subMenuDarkHover : variables.subMenuLightHover,
      "--el-icon": this.sideMenuTheme === "dark" ? variables.elIconDark : variables.elIconLight,
      "--svg-icon": this.sideMenuTheme === "dark" ? variables.svgIconDark : variables.svgIconLight,
    };
  }

  /**
   * 通过路由表获取菜单列表，筛选出只有 alwaysShowRoot 为 false，hideInMenu 为 false 的菜单列表
   */
  public getMenuListByRouter(allRolesRoutes: Array<RouteConfig>) {
    let menusList: Array<MenuRoute> = [];
    allRolesRoutes.forEach(route => {
      let r = { ...route };
      // 如果配置了 hideInMenu: true，则隐藏菜单，如果配置了 alwaysShowRoot: false | undefined 且子路由只有一个，则子路由成为一级菜单
      if (!r.meta || (r.meta && !r.meta.hideInMenu)) {
        // 如果存在 children
        if (r.children && r.children.length !== 0) {
          // 如果 children 长度为 1 且 alwaysShowRoot 为 false | undefined，则子路由成为一级菜单
          if (r.children.length === 1) {
            if (!r.meta || (r.meta && !r.meta.alwaysShowRoot)) {
              r = this.getMenuListByRouter(r.children)[0];
            } else {
              r.children = this.getMenuListByRouter(r.children);
            }
          } else {
            r.children = this.getMenuListByRouter(r.children);
          }
        }
        if (r) {
          menusList.push(r as MenuRoute);
        }
      }
    });
    return menusList;
  }
}
</script>

<style lang="scss" scoped>
.side-menu {
  height: 100%;
  overflow: hidden;
  z-index: 999;
  display: flex;
  flex-direction: column;
  .el-scrollbar {
    height: 100%;
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}
</style>

<style lang="scss">
.side-menu {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .side-menu-scrollbar {
    height: 100%;
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
