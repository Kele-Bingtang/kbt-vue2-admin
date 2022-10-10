<template>
  <div class="side-menu">
    <slot></slot>
    <el-scrollbar wrap-class="side-menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
      >
        <side-menu-item
          v-for="menu in menuList"
          :key="menu.name"
          :menu-item="menu"
          :is-collapse="isCollapse"
        />
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

export type MenuRoute = RouteConfig & {
  meta: {
    _fullPath: string; // 完整的路由（针对二级路由以上）
  };
};

@Component({
  components: {
    SideMenuItem,
  },
})
export default class SideMenu extends Vue {
  get isCollapse() {
    return LayoutModule.sideMenu.isCollapse;
  }

  get menuList() {
    return this.getMenuListByRouter(PermissionModule.loadRoutes);
  }

  // 对应菜单 Item 的 index，这样才能高亮
  get activeMenu() {
    return this.$route.path || this.$route.name;
  }
  // 获取全局样式
  get variables() {
    return variables;
  }

  // 通过路由表获取菜单列表
  public getMenuListByRouter(allRolesRoutes: Array<RouteConfig>) {
    let menusList: Array<MenuRoute> = [];
    allRolesRoutes.forEach((route) => {
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
        menusList.push(r as MenuRoute);
      }
    });
    return menusList;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.module.scss";
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
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
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
