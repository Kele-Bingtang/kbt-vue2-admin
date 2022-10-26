<template>
  <div
    :style="{ cursor, userSelect }"
    class="vue-splitter-container clearfix"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <pane class="splitter-pane splitter-paneL" :mode="mode" :style="{ [type]: percent + '%' }">
      <slot name="paneL"></slot>
    </pane>

    <resizer
      :className="className"
      :style="{ [resizeType]: percent + '%' }"
      :mode="mode"
      @mousedown.native="onMouseDown"
      @click.native="onClick"
    ></resizer>

    <pane class="splitter-pane splitter-paneR" :mode="mode" :style="{ [type]: 100 - percent + '%' }">
      <slot name="paneR"></slot>
    </pane>
    <div class="vue-splitter-container-mask" v-if="active"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Resizer from "./resizer.vue";
import Pane from "./pane.vue";

@Component({
  components: { Resizer, Pane },
})
export default class extends Vue {
  @Prop({ default: 10 })
  public minPercent!: number;
  @Prop({ default: 50 })
  public defaultPercent!: number;
  @Prop({ default: "" })
  public className!: string;
  @Prop({ required: true })
  public mode!: "vertical" | "horizontal";

  public percent = 50;
  public active = false;
  public hasMoved = false;
  public height = null;
  public type = this.mode === "vertical" ? "width" : "height";
  public resizeType = this.mode === "vertical" ? "left" : "top";

  mounted() {
    this.percent = this.defaultPercent;
  }

  get userSelect() {
    return this.active ? "none" : "";
  }
  get cursor() {
    return this.active ? (this.mode === "vertical" ? "col-resize" : "row-resize") : "";
  }

  @Watch("defaultPercent")
  public onDefaultPercentChange(newValue: number) {
    this.percent = newValue;
  }

  public onClick() {
    if (!this.hasMoved) {
      this.percent = 50;
      this.$emit("resize", this.percent);
    }
  }
  public onMouseDown() {
    this.active = true;
    this.hasMoved = false;
  }
  public onMouseUp() {
    this.active = false;
  }
  public onMouseMove(e: any) {
    if (e.buttons === 0 || e.which === 0) {
      this.active = false;
    }

    if (this.active) {
      let offset = 0;
      let target = e.currentTarget;
      if (this.mode === "vertical") {
        while (target) {
          offset += target.offsetLeft;
          target = target.offsetParent;
        }
      } else {
        while (target) {
          offset += target.offsetTop;
          target = target.offsetParent;
        }
      }

      const currentPage = this.mode === "vertical" ? e.pageX : e.pageY;
      const targetOffset = this.mode === "vertical" ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight;
      const percent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;

      if (percent > this.minPercent && percent < 100 - this.minPercent) {
        this.percent = percent;
      }

      this.$emit("resize", this.percent);
      this.hasMoved = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.vue-splitter-container {
  height: 100%;
  position: relative;
}

.vue-splitter-container-mask {
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
