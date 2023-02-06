<template>
  <div class="page-table-container">
    <el-table
      :data="tableData.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize)"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | tableStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template slot-scope="{ row }">
          <svg-icon v-for="n in row.priority" :key="n" name="star" style="color: #606266" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="tableData.length > 0"
      :total="tableData.length"
      :paging="paging"
      @pagination="handleSizeChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Pagination, { paging, Paging } from "@/components/Pagination/index.vue";
import { largeData } from "@/test/table";

@Component({ name: "PageTableDemo", components: { Pagination } })
export default class extends Vue {
  public row!: any;
  public tableStatusFilter!: any;

  public tableData = largeData;
  public paging = paging;

  public handleSizeChange(paging: Paging) {
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.page-table-container {
  padding: 20px;
  width: 100%;
  height: 100%;
}
</style>
