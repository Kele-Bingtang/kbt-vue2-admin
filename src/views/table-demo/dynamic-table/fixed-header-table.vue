<template>
  <div class="fixed-header-table-container">
    <div class="checkbox-container" style="margin-bottom: 10px">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="date">date</el-checkbox>
        <el-checkbox label="address">address</el-checkbox>
        <el-checkbox label="status">status</el-checkbox>
        <el-checkbox label="title">title</el-checkbox>
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
import { simpleData } from "@/test/table";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class FixedHeaderTable extends Vue {
  public row!: any;

  public tableData = simpleData;

  public key = 1; // Table key
  public formTheadOptions = ["date", "address", "status", "title"];
  public checkboxVal = ["date", "address", "title"];
  public formThead = this.checkboxVal;

  @Watch("checkboxVal")
  public onCheckboxValChange(value: string[]) {
    this.formThead = this.formTheadOptions.filter(i => value.indexOf(i) >= 0);
    this.key = this.key + 1;
  }
}
</script>
