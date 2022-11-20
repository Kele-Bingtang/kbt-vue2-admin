<template>
  <div class="un-fixed-header-table-container">
    <div class="checkbox-container">
      <el-checkbox-group v-model="formThead">
        <el-checkbox label="date">date</el-checkbox>
        <el-checkbox label="address">address</el-checkbox>
        <el-checkbox label="status">status</el-checkbox>
        <el-checkbox label="title">title</el-checkbox>
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
import { simpleData } from "@/test/table";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class UnfixedHeaderTable extends Vue {
  public row!: any;

  public tableData = simpleData;

  public formThead = ["date", "address"];
}
</script>
