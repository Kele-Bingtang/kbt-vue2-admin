<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Pagination extends Vue {
  @Prop({ required: true })
  public total!: number;
  @Prop({ default: 1 })
  public page!: number;
  @Prop({ default: 20 })
  public limit!: number;
  @Prop({ default: () => [10, 20, 30, 50] })
  public pageSizes!: number[];
  @Prop({ default: "total, sizes, prev, pager, next, jumper" })
  public layout!: string;
  @Prop({ default: true })
  public background!: boolean;
  @Prop({ default: false })
  public hidden!: boolean;

  get currentPage() {
    return this.page;
  }

  set currentPage(value) {
    this.$emit("update:page", value);
  }

  get pageSize() {
    return this.limit;
  }

  set pageSize(value) {
    this.$emit("update:limit", value);
  }

  handleSizeChange(value: number) {
    this.$emit("pagination", { page: this.currentPage, limit: value });
  }

  handleCurrentChange(value: number) {
    this.$emit("pagination", { page: value, limit: this.pageSize });
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
