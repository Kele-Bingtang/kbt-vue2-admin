<template>
  <!-- 判断是 path 是 http 链接还是路由 -->
  <a v-if="isExternal(to.path)" :href="to.path" target="_blank" rel="noopener">
    <slot></slot>
  </a>
  <router-link v-else :to="fullPath">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isExternal } from "@/utils/validate";
import { RouteConfig } from "vue-router";

@Component({})
export default class SideMenuItemLink extends Vue {
  @Prop({ required: true })
  public to!: RouteConfig;

  public isExternal = isExternal;

  // 取出完整的 path：_fullPath 在 ./index.vue 已经计算出来，当然你也可以直接通过 name 跳转
  get fullPath(): string {
    if (this.to.meta && this.to.meta._fullPath) {
      return this.to.meta._fullPath;
    }
    return this.to.path;
  }
}
</script>
