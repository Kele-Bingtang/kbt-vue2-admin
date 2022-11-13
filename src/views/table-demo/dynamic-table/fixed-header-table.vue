<template>
  <div class="fixed-header-table-container">
    <div class="checkbox-container" style="margin-bottom: 10px">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="date">date</el-checkbox>
        <el-checkbox label="address">address</el-checkbox>
        <el-checkbox label="tag">tag</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="name" width="180" />
      <el-table-column v-for="col in formThead" :key="col" :label="col">
        <template slot-scope="{ row }">
          {{ row[col] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class FixedHeaderTable extends Vue {
  row!: any;

  public tableData = [
    {
      id: "1",
      name: "王小虎1",
      date: "2016-05-02",
      address: "北京省普陀区金沙江路 100 弄",
      tag: "北京",
    },
    {
      id: "2",
      name: "王小虎2",
      date: "2016-05-04",
      address: "上海市普陀区金沙江路 200 弄",
      tag: "上海",
    },
    {
      id: "3",
      name: "王小虎3",
      date: "2016-05-01",
      address: "广东省普陀区金沙江路 300 弄",
      tag: "广东",
    },
    {
      id: "4",
      name: "王小虎4",
      date: "2016-05-03",
      address: "广西省普陀区金沙江路 400 弄",
      tag: "广西",
    },
  ];

  public key = 1; // Table key
  public formTheadOptions = ["date", "address", "tag"];
  public checkboxVal = ["date", "address"];
  public formThead = ["date", "address"];

  @Watch("checkboxVal")
  public onCheckboxValChange(value: string[]) {
    this.formThead = this.formTheadOptions.filter(i => value.indexOf(i) >= 0);
    this.key = this.key + 1;
  }
}
</script>
