<template>
  <!-- 使用 Element UI 图标 -->
  <i v-if="isElIcon" :class="icon" :style="{ color: color }"></i>
  <!-- 使用本地的 svg 图标，这里可以换成你需要的格式图标 -->
  <svg-icon v-else="iconType === 'svg'" :name="icon" :style="{ color: color }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// 暂时用不到该组件

@Component({})
export default class CommonIcon extends Vue {
  @Prop({ default: "" })
  public icon!: string;
  @Prop({ default: "" })
  public iconType!: string;
  @Prop({ default: "" })
  public color!: string;

  mounted() {}

  // 如果不传 iconType，则手动判断 iconType
  get isElIcon() {
    if (!this.iconType) {
      return this.icon.startsWith("el-");
    } else {
      return this.iconType === "el";
    }
  }
}
</script>

<style lang="scss" scoped></style>
