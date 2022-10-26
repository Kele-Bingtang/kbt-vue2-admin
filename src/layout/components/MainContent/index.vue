<template>
  <div class="main-content">
    <transition name="fade-transform" mode="out-in">
      <!-- 内容由路由跳转实现 -->
      <keep-alive :include="cachedTagList">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </div>
</template>

<script lang="ts">
import { LayoutModule } from "@/store/modules/layout";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class MainContent extends Vue {
  // 获取缓存的组件名
  get cachedTagList() {
    return LayoutModule.tagsNav.cachedTagList;
  }
  get key() {
    return this.$route.path || this.$route.name;
  }
}
</script>

<style lang="css" scoped>
.main-content {
  height: calc(100% - 38px);
  overflow: hidden auto;
}
</style>
