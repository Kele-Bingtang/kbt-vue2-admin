<template>
  <div class="select-excel-container">
    <el-input
      v-model="filename"
      placeholder="请输入导出的文件名，默认为 excel-table"
      style="width: 350px"
      prefix-icon="el-icon-document"
    />
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >
      导出选择的数据
    </el-button>

    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期" width="180px"></el-table-column>
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
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";
import { Table } from "element-ui";
import { largeData } from "@/test/table";

@Component({})
export default class SelectExcel extends Vue {
  public row!: any;
  public $index!: any;
  public tableStatusFilter!: any;

  public tableData = largeData;
  public loading = true;
  public multipleSelection = [];
  public downloadLoading = false;
  public filename = "";

  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  public handleSelectionChange(value: any) {
    this.multipleSelection = value;
  }

  public handleDownload() {
    if (this.multipleSelection.length) {
      this.downloadLoading = true;
      const tHeader = ["ID", "Name", "Date", "Address", "Status", "Priority", "Title"];
      const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
      const list = this.multipleSelection;
      const data = formatJsonToArray(list, filterVal);
      exportJsonToExcel(tHeader, data, this.filename !== "" ? this.filename : undefined);
      (this.$refs.multipleTable as Table).clearSelection();
      this.downloadLoading = false;
    } else {
      this.$message({
        message: "请至少选择一行数据",
        type: "warning",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.select-excel-container {
  padding: 20px;
}
</style>
