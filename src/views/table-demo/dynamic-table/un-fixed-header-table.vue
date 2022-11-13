<template>
  <div class="un-fixed-header-table-container">
    <div class="checkbox-container">
      <el-checkbox-group v-model="formThead">
        <el-checkbox label="date">date</el-checkbox>
        <el-checkbox label="address">address</el-checkbox>
        <el-checkbox label="tag">tag</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="tableData" border highlight-current-row style="width: 100%">
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
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class UnfixedHeaderTable extends Vue {
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

  public formThead = ["date", "address"];
}
</script>
