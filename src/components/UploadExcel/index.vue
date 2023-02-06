<template>
  <div class="upload-excel-component">
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" />
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      上传 Excel 文件
      <el-button :loading="loading" style="margin-left: 16px" size="mini" type="primary" @click="handleUpload">
        浏览
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { read, utils } from "xlsx";

@Component({ name: "UploadExcel" })
export default class extends Vue {
  @Prop({ required: true })
  public beforeUpload!: Function;
  @Prop({ required: true })
  public onSuccess!: Function;

  public loading = false;
  public excelData = {
    header: null,
    results: null,
  };

  public generateData(header: any, results: any) {
    this.excelData.header = header;
    this.excelData.results = results;
    this.onSuccess && this.onSuccess(this.excelData);
  }

  public handleDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading) return;
    if (!e.dataTransfer) return;
    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      this.$message.error("只支持加载一个文件!");
      return;
    }
    const rawFile = files[0]; // only use files[0]

    if (!this.isExcel(rawFile)) {
      this.$message.error("只支持 .xlsx, .xls, .csv 结尾的文件");
      return false;
    }
    this.upload(rawFile);
    e.stopPropagation();
    e.preventDefault();
  }

  public handleDragover(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }

  public handleUpload() {
    (this.$refs["excel-upload-input"] as HTMLInputElement).click();
  }

  public handleClick(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      const rawFile = files[0]; // only use files[0]
      this.upload(rawFile);
    }
  }

  public upload(rawFile: File) {
    (this.$refs["excel-upload-input"] as HTMLInputElement).value = ""; // Fixes can't select the same excel
    if (!this.beforeUpload) {
      this.readerData(rawFile);
      return;
    }
    const before = this.beforeUpload(rawFile);
    if (before) {
      this.readerData(rawFile);
    }
  }

  public readerData(rawFile: File) {
    this.loading = true;
    const reader = new FileReader();
    reader.onload = e => {
      const data = (e.target as FileReader).result;
      const workbook = read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const header = this.getHeaderRow(worksheet);
      const results = utils.sheet_to_json(worksheet);
      this.generateData(header, results);
      this.loading = false;
    };
    reader.readAsArrayBuffer(rawFile);
  }

  public getHeaderRow(sheet: { [key: string]: any }) {
    const headers: string[] = [];
    const range = utils.decode_range(sheet["!ref"]);
    const R = range.s.r;
    // start in the first row
    for (let C = range.s.c; C <= range.e.c; ++C) {
      // walk every column in the range
      const cell = sheet[utils.encode_cell({ c: C, r: R })];
      // find the cell in the first row
      let hdr = "";
      if (cell && cell.t) hdr = utils.format_cell(cell);
      if (hdr === "") {
        hdr = "UNKNOWN " + C; // replace with your desired default
      }
      headers.push(hdr);
    }
    return headers;
  }

  public isExcel(file: File) {
    return /\.(xlsx|xls|csv)$/.test(file.name);
  }
}
</script>

<style lang="scss" scoped>
.upload-excel-component {
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
}
</style>
