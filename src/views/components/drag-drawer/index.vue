<template>
  <div class="drag-drawer-container">
    <div class="drag-drawer-header">
      <el-switch
        v-model="placement"
        active-text="右"
        inactive-text="左"
        active-value="right"
        inactive-value="left"
        class="drag-drawer-switch"
      ></el-switch>
      <el-switch v-model="draggable" active-text="是否可拖拽"></el-switch>
      <el-button @click="visible1 = true" type="primary" style="margin-left: 16px">打开容器内抽屉</el-button>
      <el-button @click="visible2 = true" type="primary" style="margin-left: 16px">打开全屏抽屉</el-button>
    </div>

    <div class="drag-drawer-inner-box">
      <drag-drawer
        :visible.sync="visible1"
        :placement="placement"
        :width.sync="width1"
        :draggable="draggable"
        :inner="true"
        @on-resize="handleResize"
        title="我是标题"
      ></drag-drawer>
    </div>

    <drag-drawer
      :visible.sync="visible2"
      :placement="placement"
      :width.sync="width2"
      :draggable="draggable"
      @on-resize="handleResize"
    >
      <template #header>
        <span>我是标题</span>
      </template>
    </drag-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DragDrawer from "@/components/DragDrawer/index.vue";

@Component({ name: "DragDrawerDemo", components: { DragDrawer } })
export default class extends Vue {
  public visible1 = false;
  public visible2 = false;
  public placement = "right";
  public width1 = 200;
  public width2 = 300;
  public draggable = true;

  public handleResize(event: any) {
    // const { atMin } = event;
    // console.log(atMin);
  }
}
</script>

<style lang="scss" scoped>
.drag-drawer-container {
  padding: 20px;
  .drag-drawer-header {
    margin-bottom: 30px;
    .drag-drawer-switch {
      margin-right: 30px;
    }
  }
  .drag-drawer-inner-box {
    position: relative;
    width: 500px;
    height: 400px;
    background: var(--theme-color);
    border: 1px solid var(--theme-color);
  }
}
</style>
