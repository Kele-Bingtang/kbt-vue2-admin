<template>
  <div :class="[{ 'is-collapse': isCollapse }]" @click="toggleTrigger">
    <svg-icon name="fold" width="20" height="20" />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SideMenuTrigger extends Vue {
  @Prop({ default: false })
  public isCollapse!: boolean;

  @Emit("toggle-trigger")
  public toggleTrigger() {
    return;
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
}

.is-collapse {
  transform: rotate(180deg);
}
</style>
