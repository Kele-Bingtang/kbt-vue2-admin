<template>
  <div :class="shadowClass" class="card-info">
    <div class="card-content">
      <div class="left-area" :style="{ width: `${iconWidth}%` }">
        <i :class="icon" :style="{ fontSize: `${iconSize}px`, color: color }"></i>
      </div>
      <div class="right-area" :style="{ width: `${100 - iconWidth}%` }">
        <div style="text-align: right">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ name: "HomeCardItem" })
export default class extends Vue {
  @Prop({ default: "" })
  public shadow!: string;
  @Prop({ default: "" })
  public icon!: string;
  @Prop({ default: 48 })
  public iconSize!: number;
  @Prop({ default: "#168BF7" })
  public color!: string;
  @Prop({ default: 40 })
  public iconWidth!: number;

  get shadowClass() {
    if (this.shadow === "always") {
      return "always-shadow";
    } else if (this.shadow === "hover") {
      return "hover-shadow";
    } else {
      return "never-shadow";
    }
  }
}
</script>

<style lang="scss" scoped>
.always-shadow {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.hover-shadow:hover {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.card-info {
  height: 120px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  .card-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    .left-area {
      float: left;
      margin-left: 25px;
    }
    .right-area {
      & > div {
        float: right;
        margin-right: 32px;
      }
    }
  }
}
</style>
