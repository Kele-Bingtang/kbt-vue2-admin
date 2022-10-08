<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <transition-group name="breadcrumb" key="a">
      <el-breadcrumb-item
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
      >
        <span
          v-if="
            (breadcrumb.meta && breadcrumb.meta.notClickBread) ||
            index === breadcrumbs.length - 1
          "
          class="hidden-bread"
        >
          <template v-if="breadcrumb.meta && breadcrumb.meta.icon">
            <!-- 使用 Element UI 自带的图标 -->
            <i
              v-if="breadcrumb.meta.icon.startsWith('el-')"
              class="icon"
              :class="breadcrumb.meta.icon"
            ></i>
            <!-- 使用本地的 svg 图标 -->
            <svg-icon v-else :name="breadcrumb.meta.icon" />
          </template>
          <span>{{ showTitle(breadcrumb) }}</span>
        </span>
        <a v-else @click.prevent="handleLink(breadcrumb)">
          <template v-if="breadcrumb.meta && breadcrumb.meta.icon">
            <!-- 使用 Element UI 自带的图标 -->
            <i
              v-if="breadcrumb.meta.icon.startsWith('el-')"
              class="icon"
              :class="breadcrumb.meta.icon"
            ></i>
            <!-- 使用本地的 svg 图标 -->
            <svg-icon v-else :name="breadcrumb.meta.icon" />
          </template>
          <span>{{ showTitle(breadcrumb) }}</span></a
        >
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { compile } from "path-to-regexp";
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouteRecord } from "vue-router";
import { showTitle } from "@/utils";

@Component({})
export default class Breadcrumb extends Vue {
  @Prop({ required: true })
  public breadcrumbs!: RouteRecord[];

  public showTitle(breadcrumbItem: RouteRecord) {
    return showTitle(breadcrumbItem, this);
  }

  public handleLink(item: any) {
    const { redirect, path } = item;
    // 如果是 redirect
    if (redirect) {
      this.$router.push(redirect).catch((err) => {
        console.warn(err);
      });
      return;
    }
    // 如果是首页（面包屑的第一个），则以 name 跳转，因为首页一旦放在三、四级路由下，path 需要加上前面的父路由才能跳转
    if (item.name === this.breadcrumbs[0].name) {
      this.$router.push({ name: item.name }).catch((err) => {
        console.warn(err);
      });
      return;
    }
    // 这里的面包屑地址以 path 跳转（path 已经保存在面包屑里），你也可以和上面首页一样，直接通过 name 跳转
    this.$router.push(this.pathCompile(path)).catch((err) => {
      console.warn(err);
    });
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
    .hidden-bread {
      color: #97a8be;
      cursor: text;
    }
  }
}
</style>
