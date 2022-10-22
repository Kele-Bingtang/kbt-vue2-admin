<template>
  <div class="common-icon">
    <!-- Element UI 图标 -->
    <i v-if="iconType === 'el'" :class="icon" :style="{ color: color }"></i>
    <!-- 使用本地的 svg 图标 -->
    <svg-icon v-if="iconType === 'svg'" :name="icon" :style="{ color: color }" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// TODO：暂不使用，后面使用
@Component({})
export default class CommonIcon extends Vue {
  @Prop({ default: "" })
  public icon!: string;
  @Prop({ default: "el" })
  public iconType!: string;
  @Prop({ default: "" })
  public color!: string;
}
</script>

<style lang="scss" scoped></style>
