<template>
  <div class="merge-header-container">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="success"
      icon="el-icon-document"
      @click="handleDownload"
    >
      Excel Export
    </el-button>

    <el-table
      :data="tableData"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
      v-loading="loading"
      ref="table"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
      <el-table-column label="Info" align="center">
        <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
        <el-table-column min-width="100" label="标题"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | tableStatusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="140">
          <template slot-scope="{ row }">
            <svg-icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";
import { largeData } from "@/test/table";

@Component({ name: "MergeHeader" })
export default class extends Vue {
  public row!: any;
  public $index!: any;
  public tableStatusFilter!: any;

  public tableData = largeData;
  public loading = true;

  public downloadLoading = false;

  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  public handleDownload() {
    this.downloadLoading = true;
    const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
    const header = ["ID", "Date", "Name", "Address", "Status", "Priority", "Title"];
    const multiHeader = [["ID", "Date", "Info", "", "", "", ""]];
    const merges = ["A1:A2", "B1:B2", "C1:G1"];
    const list = this.tableData;
    const data = formatJsonToArray(list, filterVal);
    exportJsonToExcel(header, data, "merge-header", multiHeader, merges);
    this.downloadLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.merge-header-container {
  padding: 20px;
}
</style>
