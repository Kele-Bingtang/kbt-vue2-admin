<template>
  <div ref="outerWrapper" class="split-pane-components" :class="{ 'no-select': isMoving }">
    <div v-if="isHorizontal" class="split-horizontal">
      <div :style="{ bottom: `${anotherOffset}%` }" :class="[`split-pane`, 'top-pane']"><slot name="top" /></div>
      <div class="split-line-container" :style="{ top: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="horizontal" />
        </slot>
      </div>
      <div :style="{ top: `${offset}%` }" class="split-pane bottom-pane"><slot name="bottom" /></div>
    </div>
    <div v-else class="split-vertical">
      <div :style="{ right: `${anotherOffset}%` }" class="split-pane left-pane"><slot name="left" /></div>
      <div class="split-line-container" :style="{ left: `${offset}%` }" @mousedown="handleMousedown">
        <slot name="line">
          <split-line mode="vertical" />
        </slot>
      </div>
      <div :style="{ left: `${offset}%` }" class="split-pane right-pane"><slot name="right" /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SplitLine from "./SplitLine.vue";

type NumAndStr = number | string;

@Component({
  components: { SplitLine },
})
export default class SplitPane extends Vue {
  @Prop({ default: 0.5 })
  public value!: NumAndStr;
  @Prop({ default: "horizontal" })
  public mode!: "horizontal" | "vertical";
  @Prop({ default: "40px" })
  public min!: NumAndStr;
  @Prop({ default: "40px" })
  public max!: NumAndStr;

  public offset = 0;
  public initOffset = 0;
  public oldOffset: unknown = 0;
  public isMoving = false;

  get isHorizontal() {
    return this.mode === "horizontal";
  }
  get anotherOffset() {
    return 100 - this.offset;
  }
  get valueIsString() {
    return typeof this.value === "string";
  }
  get offsetSize() {
    return this.isHorizontal ? "offsetHeight" : "offsetWidth";
  }
  get computedMin() {
    return this.getComputedThresholdValue("min");
  }
  get computedMax() {
    return this.getComputedThresholdValue("max");
  }

  @Watch("value")
  public onValueChange() {
    this.init();
  }

  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  }

  public init() {
    let value = this.valueIsString
      ? this.px2percent(this.value as string, (this.$refs.outerWrapper as any)[this.offsetSize])
      : this.value;
    this.offset = ((value as number) * 10000) / 100;
  }

  public px2percent(numerator: string, denominator: string) {
    return parseFloat(numerator) / parseFloat(denominator);
  }
  public getComputedThresholdValue(type: string) {
    let _this = this as any;
    let size = (this.$refs.outerWrapper as any)[this.offsetSize];
    if (this.valueIsString) return typeof _this[type] === "string" ? _this[type] : size * _this[type];
    else return typeof _this[type] === "string" ? _this.px2percent(_this[type], size) : _this[type];
  }
  public getMin(value1: NumAndStr, value2: NumAndStr) {
    if (this.valueIsString) return `${Math.min(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
    else return Math.min(value1 as number, value2 as number);
  }
  public getMax(value1: NumAndStr, value2: NumAndStr) {
    if (this.valueIsString) return `${Math.max(parseFloat(value1 as string), parseFloat(value2 as string))}px`;
    else return Math.max(value1 as number, value2 as number);
  }
  public getAnotherOffset(value: NumAndStr) {
    let res: NumAndStr = "0";
    if (this.valueIsString)
      (res as string) = `${(this.$refs.outerWrapper as any)[this.offsetSize] - parseFloat(value as string)}px`;
    else res = 1 - (value as number);
    return res;
  }
  public handleMove(e: any) {
    let pageOffset = this.isHorizontal ? e.pageY : e.pageX;
    let offset = pageOffset - this.initOffset;
    let outerWidth = (this.$refs.outerWrapper as any)[this.offsetSize];
    let value = this.valueIsString
      ? `${parseFloat(this.oldOffset as string) + offset}px`
      : this.px2percent((outerWidth * (this.oldOffset as number) + offset) as unknown as string, outerWidth);
    let anotherValue = this.getAnotherOffset(value);
    if (parseFloat(value as string) <= parseFloat(this.computedMin)) value = this.getMax(value, this.computedMin);
    if (parseFloat(anotherValue as string) <= parseFloat(this.computedMax))
      value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax));
    e.atMin = this.value === this.computedMin;
    e.atMax = this.valueIsString
      ? this.getAnotherOffset(this.value) === this.computedMax
      : (this.getAnotherOffset(this.value) as any).toFixed(5) === this.computedMax.toFixed(5);
    this.$emit("input", value);
    this.$emit("on-moving", e);
  }
  public handleUp() {
    this.isMoving = false;
    document.removeEventListener("mousemove", this.handleMove);
    document.removeEventListener("mouseup", this.handleUp);
    this.$emit("on-move-end");
  }
  public handleMousedown(e: any) {
    this.initOffset = this.isHorizontal ? e.pageY : e.pageX;
    this.oldOffset = this.value;
    this.isMoving = true;
    document.addEventListener("mousemove", this.handleMove);
    document.addEventListener("mouseup", this.handleUp);
    this.$emit("on-move-start");
  }
}
</script>

<style lang="scss" scoped>
.split-pane-components {
  position: relative;
  width: 100%;
  height: 100%;
  .split-pane {
    position: absolute;
    &.left-pane,
    &.right-pane {
      top: 0px;
      bottom: 0px;
    }
    &.left-pane {
      left: 0px;
    }
    &.right-pane {
      right: 0px;
    }
    &.top-pane,
    &.bottom-pane {
      left: 0px;
      right: 0px;
    }
    &.top-pane {
      top: 0px;
    }
    &.bottom-pane {
      bottom: 0px;
    }
  }
  .split-vertical {
    .split-line-container {
      top: 50%;
      left: 50%;
      height: 100%;
      width: 0;
    }
  }
  .split-line-container {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
  .split-horizontal {
    .split-line-container {
      top: 50%;
      left: 50%;
      height: 0;
      width: 100%;
      position: absolute;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
  }
  &.no-select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
