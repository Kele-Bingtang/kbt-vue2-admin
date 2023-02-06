<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item" @click="doClipboard(generateElementIconCode(item))">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateElementIconCode(item) }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span class="icon-name">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Icons">
        <div class="grid">
          <div v-for="item of svgIcons" :key="item" @click="doClipboard(generateSvgIconCode(item))">
            <el-tooltip placement="top">
              <div slot="content">
                {{ generateSvgIconCode(item) }}
              </div>
              <div class="icon-item">
                <svg-icon :name="item" class="disabled" />
                <span class="icon-name">{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import elementIcons from "./element-icons";
import svgIcons from "./svg-icons";

@Component({ name: "Icons" })
export default class extends Vue {
  public svgIcons = svgIcons;
  public elementIcons = elementIcons;
  public doClipboard(item: any) {
    (this as any)
      .$copyText(item)
      .then(() => {
        this.$message({
          message: "Copy successfully",
          type: "success",
          duration: 1500,
        });
      })
      .catch(() => {
        this.$message({
          message: "Copy failed",
          type: "error",
          duration: 1500,
        });
      });
  }

  public generateElementIconCode(symbol: string) {
    return `<i class="el-icon-${symbol}" />`;
  }

  public generateSvgIconCode(symbol: string) {
    return `<svg-icon name="${symbol}" />`;
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  padding: 20px;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    > div {
      :hover {
        color: var(--theme-color);
      }
    }
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    color: #606266;
    font-size: 32px;
    cursor: pointer;
    .icon-name {
      color: #99a9bf;
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      font-size: 13px;
    }
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
