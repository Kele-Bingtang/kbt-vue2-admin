<template>
  <div class="size-select">
    <el-dropdown trigger="click" @command="handleSetSize" class="size-dropdown" style="height: 95%">
      <div class="layout-svg-btn">
        <svg-icon name="size" width="18px" height="20px" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SizeSelect extends Vue {
  @Prop({ default: "medium" })
  public size!: string;

  public sizeOptions = [
    { label: "Large", value: "large" },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" },
    { label: "Mini", value: "mini" },
  ];

  @Emit("on-change")
  public handleSetSize(size: string) {
    return size;
  }
}
</script>

<style lang="scss" scoped></style>
