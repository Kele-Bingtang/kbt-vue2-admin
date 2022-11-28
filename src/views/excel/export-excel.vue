<template>
  <div class="export-excel-container">
    <div>
      <div style="display: inline-block">
        <label class="radio-label" style="padding-left: 0">文件名：</label>
        <el-input
          v-model="filename"
          placeholder="请输入导出的文件名，默认为 excel-table"
          style="width: 345px"
          prefix-icon="el-icon-document"
        />
      </div>

      <div style="display: inline-block">
        <label class="radio-label">Cell Auto-Width：</label>
        <el-radio-group v-model="autoWidth">
          <el-radio :label="true" border>True</el-radio>
          <el-radio :label="false" border>False</el-radio>
        </el-radio-group>
      </div>

      <div style="display: inline-block">
        <label class="radio-label">文件类型：</label>
        <el-select v-model="bookType" style="width: 120px">
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </div>

      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="success"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Excel Export
      </el-button>
    </div>

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
      <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
      <el-table-column prop="title" min-width="100" label="标题"></el-table-column>
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
import { largeData } from "@/test/table";

@Component({})
export default class ExportExcel extends Vue {
  public row!: any;
  public $index!: any;
  public tableStatusFilter!: any;

  public tableData = largeData;
  public loading = true;
  public downloadLoading = false;
  public filename = "";
  public autoWidth = true;
  public bookType = "xlsx";

  public options = ["xlsx", "csv", "txt"];

  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  public handleDownload() {
    this.downloadLoading = true;
    const tHeader = ["ID", "Name", "Date", "Address", "Status", "Priority", "Title"];
    const filterVal = ["id", "name", "date", "address", "status", "priority", "title"];
    const list = this.tableData;
    const data = formatJsonToArray(list, filterVal);
    exportJsonToExcel(
      tHeader,
      data,
      this.filename !== "" ? this.filename : undefined,
      undefined,
      undefined,
      this.autoWidth,
      this.bookType
    );
    this.downloadLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.export-excel-container {
  padding: 20px;

  .radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
  }
}
</style>
