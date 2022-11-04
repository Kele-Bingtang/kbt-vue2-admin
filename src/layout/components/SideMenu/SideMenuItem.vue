<template>
  <div class="side-menu-item" :class="[isCollapse ? 'collapse-menu' : 'expand-menu', { 'first-menu': isFirstMenu }]">
    <!-- 没有二级菜单 -->
    <template v-if="!menuItem.children || menuItem.children.length == 0">
      <side-menu-item-link :to="menuItem">
        <el-menu-item
          :index="(menuItem.meta && menuItem.meta._fullPath) || menuItem.name"
          :class="{ 'only-one-item': isFirstMenu }"
        >
          <template v-if="menuItem.meta && menuItem.meta.icon">
            <!-- 使用 Element UI 自带的图标 -->
            <i v-if="menuItem.meta.icon.startsWith('el-')" class="icon" :class="menuItem.meta.icon"></i>
            <!-- 使用本地的 svg 图标 -->
            <svg-icon v-else :name="menuItem.meta.icon" />
          </template>
          <!-- 如果没有 title，则以 name 显示 -->
          <span slot="title">{{ getTitle(menuItem) }}</span>
        </el-menu-item>
      </side-menu-item-link>
    </template>
    <!-- 存在二级菜单 -->
    <el-submenu v-else :index="(menuItem.meta && menuItem.meta._fullPath) || menuItem.name" popper-append-to-body>
      <template slot="title">
        <template v-if="menuItem.meta && menuItem.meta.icon">
          <i v-if="menuItem.meta.icon.startsWith('el-')" class="icon" :class="menuItem.meta.icon"></i>
          <svg-icon v-else :name="menuItem.meta.icon" />
        </template>
        <span slot="title">{{ getTitle(menuItem) }}</span>
      </template>
      <!-- 递归循环出子菜单 -->
      <template v-if="menuItem.children">
        <side-menu-item
          v-for="child in menuItem.children"
          :key="child.name"
          :menu-item="child"
          :is-collapse="isCollapse"
          :is-first-menu="false"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import SideMenuItemLink from "./SideMenuItemLink.vue";
import { getTitle } from "@/utils/layout";

@Component({
  name: "SideMenuItem", // 解决 Vercel 打包后递归组件失效
  components: { SideMenuItemLink },
})
export default class SideMenuItem extends Vue {
  @Prop({ required: true })
  public menuItem!: RouteConfig;
  @Prop({ default: false })
  public isCollapse!: boolean;
  @Prop({ default: true })
  public isFirstMenu!: boolean; // 是否是一级菜单

  public getTitle(menuItem: RouteConfig) {
    return getTitle(menuItem, this);
  }
}
</script>

<style lang="scss" scoped>
.side-menu-item {
  &.expand-menu {
    .svg-icon {
      margin-right: 16px;
      vertical-align: middle;
    }
    .icon {
      font-size: 18px;
      margin-left: -2px;
      margin-right: 12px;
    }
  }
  &.collapse-menu {
    .svg-icon {
      margin-left: 20px;
      vertical-align: middle;
    }
    .icon {
      font-size: 18px;
      margin-left: 18px;
    }
  }
  // 激活的图标颜色要和文字保持一致，所以只修改没有激活的图标样式
  .el-menu-item:not(.is-active),
  .el-submenu > .el-submenu__title {
    .svg-icon {
      color: var(--svg-icon);
    }
    .icon {
      color: var(--el-icon);
    }
  }
}
</style>

<style lang="scss">
@import "~@/styles/variables.module.scss";
.side-menu-item {
  // 一级菜单悬停样式
  .el-menu-item:hover,
  .el-submenu .el-submenu__title:hover {
    background-color: var(--menu-hover) !important;
  }
  // 展开的菜单
  &.expand-menu {
    // 每个多级菜单样式，默认折叠后的多级菜单背景色和整体菜单背景色一样，这里仅修改展开的背景色
    .nest-menu .el-submenu > .el-submenu__title,
    .el-submenu .el-menu-item {
      min-width: $sideMenuWidth !important;
      background-color: var(--sub-menu-bg) !important;
      &:hover {
        background-color: var(--sub-menu-hover) !important;
      }
    }
    // 多级菜单激活的文字颜色，（不再使用）现在悬停的颜色已经跟全局 theme 保持一致，如果想自定义，取消这个注释
    .el-submenu.is-active > .el-menu .nest-menu .el-menu-item.is-active {
      // color: $subMenuActiveText !important;
    }
  }

  // 折叠的菜单，包含了解决折叠后文字不隐藏问题
  &.collapse-menu {
    // 一级菜单样式
    &.first-menu {
      .only-one-item {
        padding: 0 !important;
        position: relative;

        .el-tooltip {
          padding: 0 !important;
        }
      }

      .el-submenu {
        overflow: hidden;

        & > .el-submenu__title {
          padding: 0px !important;
          // 解决折叠后下拉箭头不隐藏问题
          .el-submenu__icon-arrow {
            display: none;
          }
          // 解决折叠后文字不隐藏问题
          & > span {
            display: none;
          }
        }
      }
    }
    // 多级菜单样式
    &.nest-menu {
      .svg-icon {
        margin-left: 2px !important;
        margin-right: 14px;
      }
      .icon {
        margin-left: 0 !important;
        margin-right: 12px;
      }
      .sub-el-icon {
        margin-right: 12px;
        margin-left: -2px;
      }
      .el-submenu > .el-submenu__title,
      .el-menu-item {
        &:hover {
          background-color: var(--sub-menu-hover) !important;
        }
      }
      // 多级菜单文字激活的样式，（不再使用）现在悬停的颜色已经跟全局 theme 保持一致，如果想自定义，取消这个注释
      .el-menu-item.is-active {
        // color: var(--sub-menu-active-text) !important;
      }
    }
  }
}

// 菜单折叠后，修改滚动条样式
.el-menu--vertical {
  > .el-menu--popup {
    max-height: 100vh;
    overflow-y: auto;

    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }
    // 滚动条颜色
    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
}
</style>
