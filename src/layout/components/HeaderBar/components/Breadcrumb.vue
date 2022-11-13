<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <transition-group name="breadcrumb" key="a">
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.path">
        <span
          v-if="(breadcrumb.meta && breadcrumb.meta.notClickBread) || index === breadcrumbs.length - 1"
          class="hide-bread"
        >
          <template v-if="breadcrumb.meta && breadcrumb.meta.icon">
            <!-- 使用 Element UI 自带的图标 -->
            <i v-if="breadcrumb.meta.icon.startsWith('el-')" class="icon" :class="breadcrumb.meta.icon"></i>
            <!-- 使用本地的 svg 图标 -->
            <svg-icon v-else :name="breadcrumb.meta.icon" />
          </template>
          <span>{{ getTitle(breadcrumb) }}</span>
        </span>
        <a v-else @click.prevent="handleLink(breadcrumb)">
          <template v-if="breadcrumb.meta && breadcrumb.meta.icon">
            <!-- 使用 Element UI 自带的图标 -->
            <i v-if="breadcrumb.meta.icon.startsWith('el-')" class="icon" :class="breadcrumb.meta.icon"></i>
            <!-- 使用本地的 svg 图标 -->
            <svg-icon v-else :name="breadcrumb.meta.icon" />
          </template>
          <span>{{ getTitle(breadcrumb) }}</span>
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { compile } from "path-to-regexp";
import { Component, Prop, Vue } from "vue-property-decorator";
import { getTitle } from "@/utils/layout";
import { Breadcrumbs } from "../index.vue";

@Component({})
export default class Breadcrumb extends Vue {
  @Prop({ required: true })
  public breadcrumbs!: Breadcrumbs[];
  // 获取展示的 title
  public getTitle(breadcrumbItem: Breadcrumbs) {
    return getTitle(breadcrumbItem, this);
  }
  // 点击面包屑跳转
  public handleLink(item: Breadcrumbs) {
    const { redirect, fullPath } = item;
    // 如果是 redirect
    if (this.$route.fullPath !== redirect) {
      if (redirect) {
        this.$router.push(redirect as string).catch(err => {
          console.warn(err);
        });
        return;
      }
      if (fullPath.indexOf("?") === -1) {
        // 这里的面包屑地址以 fullPath 跳转（fullPath 已经保存在面包屑里），你也可以和通过 name 跳转
        this.$router.push(this.pathCompile(fullPath)).catch(err => {
          console.warn(err);
        });
      } else {
        let f = fullPath.split("?");
        this.$router.push(this.pathCompile(f[0]) + "?" + f[1]).catch(err => {
          console.warn(err);
        });
      }
    }
  }

  // 如果路由 url 是 /user/:id/:name，参数 data 为 {id: 10001, name: 'bob'}，则解析成 /user/10001/bob，格式：compile(url)(data)
  private pathCompile(path: string) {
    const { params } = this.$route;
    const toPath = compile(path);
    return toPath(params);
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.breadcrumb {
  &.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
    .icon {
      margin-right: 7px;
    }
    .svg-icon {
      font-size: 12px;
      margin-right: 9px;
    }
    .hide-bread {
      color: #97a8be;
      cursor: text;
    }
  }
}
</style>
