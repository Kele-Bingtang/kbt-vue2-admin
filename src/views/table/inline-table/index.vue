<template>
  <div class="inline-table-container">
    <p>
      目前仅
      <span style="color: red">标题</span>
      可以修改，其他字段也是类似
    </p>
    <el-table
      :data="tableData"
      @row-dblclick="handleEdit"
      border
      highlight-current-row
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
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

      <el-table-column min-width="250px" label="标题">
        <template slot-scope="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button v-else type="text" icon="el-icon-edit" @click="handleEdit(row)" class="btn-primary">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { simpleData } from "@/test/table";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class InlineEditTable extends Vue {
  public row!: any;
  public tableStatusFilter!: any;

  public tableData = simpleData;

  mounted() {
    this.tableData.map(item => {
      this.$set(item, "edit", false);
      this.$set(item, "originalTitle", item.title);
      return item;
    });
  }

  public handleEdit(row: any) {
    if (row.edit) {
      this.cancelEdit(row);
    } else {
      row.edit = !row.edit;
    }
  }

  public cancelEdit(row: any) {
    row.title = row.originalTitle;
    row.edit = false;
    this.$message({
      message: "标题已恢复为原始值！",
      type: "warning",
    });
  }

  public confirmEdit(row: any) {
    row.edit = false;
    row.originalTitle = row.title;
    this.$message({
      message: "标题已编辑！",
      type: "success",
    });
  }
}
</script>

<style lang="scss" scoped>
.inline-table-container {
  padding: 20px;
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
}
</style>
