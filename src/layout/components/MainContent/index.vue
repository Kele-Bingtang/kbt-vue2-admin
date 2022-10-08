<template>
  <div>
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <!-- 内容由路由跳转实现 -->
      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class MainContent extends Vue {

  // get cacheList() {
  //   const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
  //   return list
  // }

  get key() {
    return this.$route.name || this.$route.path
  }
}
</script>

<style lang='css' scoped>

</style>
