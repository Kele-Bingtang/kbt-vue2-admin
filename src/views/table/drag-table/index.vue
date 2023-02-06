<template>
  <div class="drag-table-container">
    <p>循环 table-column 可以实现列和行拖拽</p>
    <!-- 实现行拖拽, 必须指定 row-key 为一条数据的唯一值 -->
    <el-table ref="draggableTable1" :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column
        v-for="(item, index) in col"
        :key="`col_${index}`"
        :prop="dropCol[index].prop"
        :label="item.label"
        :type="item.type"
        :width="item.width"
      >
        <template slot-scope="scope">
          <template v-if="dropCol[index].prop === 'status'">
            <el-tag :type="scope.row.status | tableStatusFilter">
              {{ scope.row.status }}
            </el-tag>
          </template>
          <template v-else>
            {{ scope.row[dropCol[index].prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <p>完整 table-column 只能实现行拖拽</p>
    <el-table ref="draggableTable2" :data="tableData" border highlight-current-row row-key="id" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tableStatusFilter">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sortable from "sortablejs";
import { simpleData } from "@/test/table";

interface ColItem {
  label: string;
  prop: string;
  type?: string;
  width?: string;
}

@Component({ name: "DragTable" })
export default class extends Vue {
  public scope!: any;
  public tableStatusFilter!: any;

  public col: Array<ColItem> = [
    {
      label: "ID",
      prop: "id",
      width: "50",
    },
    {
      label: "姓名",
      prop: "name",
    },
    {
      label: "日期",
      prop: "date",
    },

    {
      label: "地址",
      prop: "address",
    },
    {
      label: "状态",
      prop: "status",
    },
  ];
  public dropCol: Array<ColItem> = [];
  // 一条数据必须有个唯一的 id
  public tableData = simpleData;

  public sortable: any = null;

  created() {
    this.dropCol = [...this.col];
    this.$nextTick(() => {
      this.rowDrop();
      this.columnDrop();
      this.rowDrop2();
    });
  }
  // 循环 table-column 行拖拽
  public rowDrop() {
    const el = (this.$refs.draggableTable1 as Vue).$el.querySelector(
      ".el-table__body-wrapper > table > tbody"
    ) as HTMLElement;
    this.sortable = Sortable.create(el, {
      ghostClass: "sortable-ghost",
      onEnd: (evt: any) => {
        if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
          // 删除选择的行，并获取
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          // 获取的行插入到新的地方
          this.tableData.splice(evt.newIndex, 0, targetRow);
        }
      },
    });
  }
  // 列拖拽
  public columnDrop() {
    const el = (this.$refs.draggableTable1 as Vue).$el.querySelector(".el-table__header-wrapper tr") as HTMLElement;
    this.sortable = Sortable.create(el, {
      animation: 180,
      delay: 0,
      onEnd: (evt: any) => {
        if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
          const targetItem = this.dropCol.splice(evt.oldIndex, 1)[0];
          this.dropCol.splice(evt.newIndex, 0, targetItem);
        }
      },
    });
  }
  // 完整 table-column 行拖拽
  public rowDrop2() {
    const el = (this.$refs.draggableTable2 as Vue).$el.querySelector(
      ".el-table__body-wrapper > table > tbody"
    ) as HTMLElement;
    this.sortable = Sortable.create(el, {
      ghostClass: "sortable-ghost",
      onEnd: (evt: any) => {
        if (typeof evt.oldIndex !== "undefined" && typeof evt.newIndex !== "undefined") {
          // 删除选择的行，并获取
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          // 获取的行插入到新的地方
          this.tableData.splice(evt.newIndex, 0, targetRow);
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.drag-table-container {
  padding: 20px;
}
</style>

<style lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
