<template>
  <div class="side-menu-trigger" :class="[{ 'not-collapse': !isCollapse }]" @click="toggleTrigger">
    <svg-icon name="fold" width="20" height="20" />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SideMenuTrigger extends Vue {
  @Prop({ default: false })
  public isCollapse!: boolean;

  @Emit()
  public toggleTrigger() {
    return;
  }
}
</script>

<style lang="scss" scoped>
.side-menu-trigger {
  .svg-icon {
    vertical-align: middle;
  }
}
.not-collapse {
  transform: rotate(180deg) !important;
}
</style>
