<template>
  <div class="upload-excel-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

@Component({ components: { name: "UploadExcel", UploadExcelComponent } })
export default class extends Vue {
  public tableData: any = [];
  public tableHeader: string[] = [];

  public beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (isLt1M) {
      return true;
    }
    this.$message({
      message: "Please do not upload files larger than 1m in size.",
      type: "warning",
    });
    return false;
  }

  public handleSuccess({ results, header }: { results: any; header: string[] }) {
    this.tableData = results;
    this.tableHeader = header;
  }
}
</script>

<style lang="scss" scoped>
.upload-excel-container {
  padding: 20px;
}
</style>
