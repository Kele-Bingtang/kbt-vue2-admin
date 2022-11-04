<template>
  <div class="draggable-dialog-container">
    <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog（有边界拖拽）</el-button>

    <el-dialog
      title="收货地址"
      :visible.sync="dialogTableVisible"
      v-draggable-dialog
      @on-dialog-drag="handleDialogDrag"
    >
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog>

    <el-button type="text" @click="dialogFormVisible = true" style="margin-left: 20px">
      打开嵌套表单的 Dialog（无边界拖拽）
    </el-button>

    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      v-draggable-dialog-no-bounds
      @on-dialog-drag="handleDialogDrag"
    >
      <el-form :model="form">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" label-width="120px">
          <el-select v-model="form.region" placeholder="请选择活动区域" ref="select">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class DraggableDialogDemo extends Vue {
  public gridData = [
    {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    },
    {
      date: "2016-05-04",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    },
    {
      date: "2016-05-01",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    },
    {
      date: "2016-05-03",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    },
  ];
  public dialogTableVisible = false;
  public dialogFormVisible = false;
  public form = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: "",
  };

  // dialog-drag 移动过程的回调，在 v-draggable-dialog 里触发
  public handleDialogDrag() {
    (this.$refs.select as any).blur();
  }
}
</script>

<style lang="scss" scoped>
.draggable-dialog-container {
  padding: 20px;
}
</style>
