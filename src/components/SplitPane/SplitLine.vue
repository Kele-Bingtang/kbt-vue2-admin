<template>
  <div class="split-trigger-components" :class="classes">
    <div class="split-trigger-bar" :class="barConClasses"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Trigger extends Vue {
  @Prop({ required: true })
  public mode!: "vertical" | "horizontal";

  get isVertical() {
    return this.mode === "vertical";
  }
  get classes() {
    return this.isVertical ? "split-trigger-vertical" : "split-trigger-horizontal";
  }
  get barConClasses() {
    return this.isVertical ? "vertical" : "horizontal";
  }
}
</script>

<style lang="scss" scoped>
$trigger-background: #f8f8f9;

.split-trigger-components {
  .split-trigger-bar {
    position: absolute;
    overflow: hidden;
    &.horizontal {
      transform: translate(0, -50%);
    }
    &.vertical {
      transform: translate(-50%, 0);
    }
  }
  &.split-trigger-vertical {
    width: 5px;
    height: 100%;
    background: $trigger-background;
    cursor: col-resize;
    .split-trigger-bar {
      width: 1px;
      height: 100%;
      box-sizing: border-box;
      background: #000;
      position: absolute;
      left: 3px;
      opacity: 0.3;
      z-index: 1;
      background-clip: padding-box;
    }
  }
  &.split-trigger-horizontal {
    width: 100%;
    height: 3px;
    background: $trigger-background;
    box-shadow: 0 0 4px 0 rgba(28, 36, 56, 0.4);
    cursor: row-resize;
  }
}
</style>
