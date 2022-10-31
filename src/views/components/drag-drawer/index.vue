<template>
  <div class="drag-drawer-container">
    <el-button @click="visible = true" type="primary" style="margin-left: 16px">点我打开</el-button>

    <drag-drawer
      :visible.sync="visible"
      :placement="placement"
      :width.sync="width"
      :draggable="draggable"
      @on-resize="handleResize"
    >
  </drag-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DragDrawer from "@/components/DragDrawer/index.vue";

@Component({
  components: { DragDrawer },
})
export default class DragDrawerDemo extends Vue {
  public visible = false;
  public placement = "top";
  public width = 300;
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
}
</style>
