<template>
  <div :class="{ hidden: hidden }" class="pagination-component">
    <el-pagination
      :background="background"
      :current-page.sync="pageObj.currentPage"
      :page-size.sync="pageObj.pageSize"
      :page-sizes="pageObj.pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { scrollTo } from "@/utils/scroll-to";

export interface Paging {
  currentPage: number;
  pageSizes: number[];
  pageSize: number;
}

export const paging = {
  currentPage: 1,
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: 20,
};

@Component({})
export default class Pagination extends Vue {
  @Prop({ required: true })
  public total!: number;
  @Prop({ default: () => paging })
  public paging!: Paging;
  @Prop({ default: "total, sizes, prev, pager, next, jumper" })
  public layout!: string;
  @Prop({ default: true })
  public background!: boolean;
  @Prop({ default: true })
  public autoScroll!: boolean;
  @Prop({ default: false })
  public hidden!: boolean;

  public pageObj!: Paging;

  created() {
    this.pageObj = this.paging;
  }

  handleSizeChange(value: number) {
    this.pageObj.pageSize = value;
    this.$emit("pagination", this.paging);
    this.$nextTick(() => {
      if (this.autoScroll) {
        scrollTo("el-table__body-wrapper", 0, 700);
        scrollTo("main-content", 0, 700);
      }
    });
  }

  handleCurrentChange(value: number) {
    this.paging.currentPage = value;
    this.$emit("pagination", this.paging);
    this.$nextTick(() => {
      if (this.autoScroll) {
        scrollTo("el-table__body-wrapper", 0, 700);
        scrollTo("main-content", 0, 700);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.pagination-component {
  background: #fff;
  padding: 32px 16px;
}

.pagination-component.hidden {
  display: none;
}
</style>
