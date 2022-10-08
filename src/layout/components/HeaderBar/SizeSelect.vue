<template>
  <div class="size-select">
    <el-tooltip effect="dark" :content="content" placement="bottom">
      <el-dropdown trigger="click" @command="handleSetSize">
        <div>
          <svg-icon class="size-icon" name="size" />
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
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SizeSelect extends Vue {
  public sizeOptions = [
    { label: "Default", value: "default" },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" },
    { label: "Mini", value: "mini" },
  ];

  get content() {
    let content = this.$t("$navbar.size");
    return content === "$navbar.size" ? "布局大小" : content;
  }

  @Prop({
    default: "medium",
  })
  public size!: string;

  @Emit("handleSetSize")
  public handleSetSize(size: string) {
    return size;
  }
}
</script>
